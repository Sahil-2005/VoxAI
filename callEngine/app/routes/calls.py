import os
import tempfile
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from twilio.rest import Client

router = APIRouter()


# ── Pydantic models ────────────────────────────────────────────────────────────

class FlowItem(BaseModel):
    key: str
    text: str
    hints: str = ""
    is_question: bool

class ScriptData(BaseModel):
    slug: str
    name: str
    language: str = "en-US"
    voice_type: str = "female"
    flow: List[FlowItem]

class CallTriggerRequest(BaseModel):
    phone_number: str
    script_slug: str
    twilio_account_sid: str
    twilio_auth_token: str
    twilio_phone: str
    script_data: ScriptData

class AudioGenerationRequest(BaseModel):
    script_data: ScriptData


# ── Comprehensive voice mapping ────────────────────────────────────────────────
VOICE_MAP = {
    "en-US": {
        "male":    "en-US-GuyNeural",
        "female":  "en-US-AriaNeural",
        "neutral": "en-US-JennyNeural",
    },
    "en-GB": {
        "male":    "en-GB-RyanNeural",
        "female":  "en-GB-SoniaNeural",
        "neutral": "en-GB-LibbyNeural",
    },
    "hi-IN": {
        "male":    "hi-IN-MadhurNeural",
        "female":  "hi-IN-SwaraNeural",
        "neutral": "hi-IN-SwaraNeural",
    },
    "es-ES": {
        "male":    "es-ES-AlvaroNeural",
        "female":  "es-ES-ElviraNeural",
        "neutral": "es-ES-ElviraNeural",
    },
    "fr-FR": {
        "male":    "fr-FR-HenriNeural",
        "female":  "fr-FR-DeniseNeural",
        "neutral": "fr-FR-DeniseNeural",
    },
    "de-DE": {
        "male":    "de-DE-ConradNeural",
        "female":  "de-DE-KatjaNeural",
        "neutral": "de-DE-KatjaNeural",
    },
    "ja-JP": {
        "male":    "ja-JP-KeitaNeural",
        "female":  "ja-JP-NanamiNeural",
        "neutral": "ja-JP-NanamiNeural",
    },
    "zh-CN": {
        "male":    "zh-CN-YunxiNeural",
        "female":  "zh-CN-XiaoxiaoNeural",
        "neutral": "zh-CN-XiaoxiaoNeural",
    },
}


# ── Routes ─────────────────────────────────────────────────────────────────────

@router.post("/trigger")
async def trigger_call(request: CallTriggerRequest):
    """
    Trigger a call using user's Twilio credentials and custom script.
    """
    try:
        from app.database import get_database
        db = get_database()
        if db is None:
            raise HTTPException(status_code=500, detail="Database not connected")

        # Upsert script to database
        await db["scripts"].update_one(
            {"slug": request.script_data.slug},
            {"$set": {
                "slug": request.script_data.slug,
                "name": request.script_data.name,
                "language": request.script_data.language,
                "voice_type": request.script_data.voice_type,
                "recognition_language": getattr(request.script_data, "recognition_language", "en-US"),
                "flow": [item.dict() for item in request.script_data.flow],
            }},
            upsert=True,
        )

        # Create Twilio client with user-supplied credentials
        client = Client(request.twilio_account_sid, request.twilio_auth_token)

        base_url = os.getenv("BASE_URL")
        webhook_url = f"{base_url}/voice/start?script={request.script_slug}"

        call = client.calls.create(
            to=request.phone_number,
            from_=request.twilio_phone,
            url=webhook_url,
        )

        return {"success": True, "call_sid": call.sid, "status": call.status}

    except Exception as e:
        print(f"❌ Error triggering call: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{slug}/generate-audio")
async def generate_audio_for_script(slug: str, request: AudioGenerationRequest):
    """
    Generate TTS audio for each flow item and upload to Cloudinary.
    No local files are persisted — a temp file is created per item,
    uploaded, then deleted immediately.
    """
    try:
        import edge_tts
        from app.cloudinary_client import upload_audio

        language   = request.script_data.language   or "en-US"
        voice_type = request.script_data.voice_type or "female"

        language_voices = VOICE_MAP.get(language, VOICE_MAP["en-US"])
        voice = language_voices.get(voice_type, language_voices.get("female"))

        generated: List[str] = []
        failed:    List[dict] = []

        for item in request.script_data.flow:
            tmp_path = None
            try:
                print(f"🎙️  Generating: {item.key} ...")

                with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
                    tmp_path = tmp.name

                communicate = edge_tts.Communicate(item.text, voice)
                await communicate.save(tmp_path)

                secure_url = await upload_audio(tmp_path, slug, item.key)
                generated.append(item.key)
                print(f"✅ Uploaded: {item.key} → {secure_url}")

            except Exception as e:
                print(f"❌ Error for {item.key}: {e}")
                failed.append({"key": item.key, "error": str(e)})
            finally:
                if tmp_path and os.path.exists(tmp_path):
                    os.remove(tmp_path)

        return {
            "success": True,
            "message": f"Audio generated and uploaded to Cloudinary for '{slug}'",
            "voice_used": voice,
            "generated": generated,
            "failed": failed,
        }

    except Exception as e:
        print(f"❌ Error generating audio: {e}")
        raise HTTPException(status_code=500, detail=str(e))
