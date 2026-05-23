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

        # ── Default system nodes required by voice.py ──────────────────────────
        # voice.py always calls get_audio_url(slug, "intro"), "outro", and "error".
        # If the frontend payload omits these keys the Cloudinary asset won't exist
        # and Twilio will receive a 404, crashing the call. We inject sensible
        # language-aware defaults for any missing system key before generation.
        SYSTEM_DEFAULTS: dict[str, dict[str, str]] = {
            "intro": {
                "en-US": "Hello! Please press any key to start.",
                "en-GB": "Hello! Please press any key to start.",
                "hi-IN": "नमस्ते! जारी रखने के लिए कोई भी बटन दबाएँ।",
                "es-ES": "¡Hola! Por favor, presione cualquier tecla para comenzar.",
                "fr-FR": "Bonjour! Veuillez appuyer sur n'importe quelle touche pour commencer.",
                "de-DE": "Hallo! Bitte drücken Sie eine beliebige Taste, um zu beginnen.",
                "ja-JP": "こんにちは！何かキーを押して開始してください。",
                "zh-CN": "你好！请按任意键开始。",
            },
            "outro": {
                "en-US": "Thank you for your time. Goodbye!",
                "en-GB": "Thank you for your time. Goodbye!",
                "hi-IN": "आपके समय के लिए धन्यवाद। अलविदा!",
                "es-ES": "Gracias por su tiempo. ¡Adiós!",
                "fr-FR": "Merci pour votre temps. Au revoir!",
                "de-DE": "Danke für Ihre Zeit. Auf Wiedersehen!",
                "ja-JP": "お時間をいただきありがとうございます。さようなら！",
                "zh-CN": "感谢您的时间。再见！",
            },
            "error": {
                "en-US": "Sorry, I didn't catch that. Please try again.",
                "en-GB": "Sorry, I didn't catch that. Please try again.",
                "hi-IN": "माफ़ करें, मुझे आपकी बात सुनाई नहीं दी। कृपया दोबारा बोलें।",
                "es-ES": "Lo siento, no entendí eso. Por favor, inténtelo de nuevo.",
                "fr-FR": "Désolé, je n'ai pas compris. Veuillez réessayer.",
                "de-DE": "Entschuldigung, ich habe das nicht verstanden. Bitte versuchen Sie es erneut.",
                "ja-JP": "申し訳ありません、聞き取れませんでした。もう一度お試しください。",
                "zh-CN": "对不起，我没有听清楚。请再试一次。",
            },
        }

        # Build the generation queue: start from the incoming flow items …
        existing_keys = {item.key for item in request.script_data.flow}
        generation_queue: List[dict] = [
            {"key": item.key, "text": item.text}
            for item in request.script_data.flow
        ]

        # … then append any missing system nodes with localised default text
        for system_key, translations in SYSTEM_DEFAULTS.items():
            if system_key not in existing_keys:
                default_text = translations.get(language, translations["en-US"])
                generation_queue.append({"key": system_key, "text": default_text})
                print(f"ℹ️  Auto-injecting default '{system_key}' node for lang={language}")

        for item in generation_queue:
            tmp_path = None
            key  = item["key"]
            text = item["text"]
            try:
                print(f"🎙️  Generating: {key} ...")

                with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
                    tmp_path = tmp.name

                communicate = edge_tts.Communicate(text, voice)
                await communicate.save(tmp_path)

                secure_url = await upload_audio(tmp_path, slug, key)
                generated.append(key)
                print(f"✅ Uploaded: {key} → {secure_url}")

            except Exception as e:
                print(f"❌ Error for {key}: {e}")
                failed.append({"key": key, "error": str(e)})
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
