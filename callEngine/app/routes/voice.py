import os
import json
import glob
from fastapi import APIRouter, Request, Response, Depends
from twilio.twiml.voice_response import VoiceResponse, Gather
from app.conversation.store import save_answer
from app.security import validate_twilio_request
from app.cloudinary_client import get_audio_url

router = APIRouter()

# --- CACHE SCRIPTS IN MEMORY ---
SCRIPTS_CACHE = {}

def load_scripts():
    files = glob.glob("app/scripts/*.json")
    for file in files:
        try:
            with open(file, "r", encoding="utf-8") as f:
                data = json.load(f)
                slug = data.get("slug")
                if slug:
                    questions = [item for item in data.get("flow", []) if item.get("is_question")]
                    SCRIPTS_CACHE[slug] = {
                        "full_flow": data.get("flow", []),
                        "questions": questions
                    }
                    print(f"✅ Loaded script: {slug}")
        except Exception as e:
            print(f"❌ Error loading {file}: {e}")

load_scripts()


@router.post("/start", dependencies=[Depends(validate_twilio_request)])
async def start_call(request: Request):
    script_slug = request.query_params.get("script", "agrosathi")

    # Try to load from database first
    from app.database import get_database
    db = get_database()
    script_data = None

    if db is not None:
        script_data = await db["scripts"].find_one({"slug": script_slug})

    # Fallback to cache if not in database
    if not script_data and script_slug not in SCRIPTS_CACHE:
        load_scripts()

    # Use database script or cache
    if script_data:
        questions = [item for item in script_data.get("flow", []) if item.get("is_question")]
    elif script_slug in SCRIPTS_CACHE:
        questions = SCRIPTS_CACHE[script_slug]["questions"]
    else:
        vr = VoiceResponse()
        vr.say("System error. Script not found.")
        vr.hangup()
        return Response(str(vr), media_type="application/xml")

    vr = VoiceResponse()

    # Play intro audio from Cloudinary (deterministic URL — no filesystem check needed)
    intro_url = get_audio_url(script_slug, "intro")
    vr.play(intro_url)

    # Wait for button press to start
    gather = Gather(
        input="dtmf",
        action=f"/voice/answer?step=-1&retry=0&script={script_slug}",
        timeout=10,
        numDigits=1
    )
    vr.append(gather)

    return Response(str(vr), media_type="application/xml")


@router.post("/answer", dependencies=[Depends(validate_twilio_request)])
async def handle_answer(request: Request, step: int, retry: int = 0, script: str = "agrosathi"):
    form = await request.form()
    speech = form.get("SpeechResult")
    digits = form.get("Digits")
    call_id = form.get("CallSid")
    user_phone = form.get("To")

    # Load script from database or cache
    from app.database import get_database
    db = get_database()
    script_data = None

    if db is not None:
        script_data = await db["scripts"].find_one({"slug": script})

    if not script_data and script not in SCRIPTS_CACHE:
        load_scripts()

    # Get questions and recognition language
    recognition_language = "en-US"  # Default
    if script_data:
        QUESTIONS = [item for item in script_data.get("flow", []) if item.get("is_question")]
        recognition_language = script_data.get("recognition_language", "en-US")
    elif script in SCRIPTS_CACHE:
        QUESTIONS = SCRIPTS_CACHE[script]["questions"]
    else:
        return Response(str(VoiceResponse().hangup()), media_type="application/xml")

    vr = VoiceResponse()

    # --- HANDLE START ---
    if step == -1:
        # User pressed start button. Move immediately to Q1 (Index 0)
        return await ask_question(vr, 0, 0, script, QUESTIONS, recognition_language)

    # --- VALIDATE INPUT ---
    user_input = speech or digits or ""

    if not user_input or len(user_input.strip()) < 1:
        if retry >= 2:
            # Failed 3 times — play outro from Cloudinary and hangup
            vr.play(get_audio_url(script, "outro"))
            vr.hangup()
            return Response(str(vr), media_type="application/xml")

        # Play error prompt from Cloudinary and ask SAME question again
        vr.play(get_audio_url(script, "error"))
        return await ask_question(vr, step, retry + 1, script, QUESTIONS, recognition_language)

    # ✅ SAVE ANSWER TO DB
    if 0 <= step < len(QUESTIONS):
        current_q = QUESTIONS[step]
        print(f"✅ Saving: {current_q['key']} = {user_input}")
        await save_answer(call_id, current_q['key'], user_input, phone=user_phone)

    # --- NEXT STEP ---
    next_step = step + 1

    if next_step >= len(QUESTIONS):
        # END OF CONVERSATION — send webhook then play outro
        from app.database import get_database
        from app.utils.webhook import send_call_completion_webhook

        db = get_database()
        call_data = None
        if db is not None:
            call_data = await db["calls"].find_one({"call_sid": call_id})

        if call_data:
            responses = call_data.get("answers", {})
            await send_call_completion_webhook(
                call_sid=call_id,
                responses=responses,
                status="completed"
            )

        # Play outro from Cloudinary and hangup
        vr.play(get_audio_url(script, "outro"))
        vr.hangup()
        return Response(str(vr), media_type="application/xml")

    return await ask_question(vr, next_step, 0, script, QUESTIONS, recognition_language)


async def ask_question(vr, step_index, retry, script_slug, questions_list, recognition_language="en-US"):
    question_data = questions_list[step_index]
    key = question_data["key"]
    hint_text = question_data.get("hints", "")

    # Build Cloudinary URL deterministically — no DB / filesystem lookup needed
    audio_url = get_audio_url(script_slug, key)

    # 🟢 Play audio BEFORE gather to prevent "skip" on immediate noise detection
    vr.play(audio_url)

    gather = Gather(
        input="dtmf speech",
        action=f"/voice/answer?step={step_index}&retry={retry}&script={script_slug}",
        language=recognition_language,
        timeout=4,
        hints=hint_text,
        enhanced=True,
        speechModel="phone_call"
    )

    vr.append(gather)
    return Response(str(vr), media_type="application/xml")