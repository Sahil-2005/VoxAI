from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from twilio.rest import Client
import os

router = APIRouter()

# Pydantic models for request validation
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

@router.post("/trigger")
async def trigger_call(request: CallTriggerRequest):
    """
    Trigger a call using user's Twilio credentials and custom script
    """
    try:
        # Store script in database for this call
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
                "flow": [item.dict() for item in request.script_data.flow]
            }},
            upsert=True
        )
        
        # Create Twilio client with user's credentials
        client = Client(
            request.twilio_account_sid,
            request.twilio_auth_token
        )
        
        # Construct webhook URL
        base_url = os.getenv("BASE_URL")
        webhook_url = f"{base_url}/voice/start?script={request.script_slug}"
        
        # Make the call
        call = client.calls.create(
            to=request.phone_number,
            from_=request.twilio_phone,
            url=webhook_url
        )
        
        return {
            "success": True,
            "call_sid": call.sid,
            "status": call.status
        }
    except Exception as e:
        print(f"❌ Error triggering call: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{slug}/generate-audio")
async def generate_audio_for_script(slug: str, request: AudioGenerationRequest):
    """
    Generate audio files for a script
    """
    try:
        import asyncio
        import edge_tts
        
        # Voice mapping
        VOICE_MAP = {
            "male": "en-US-GuyNeural",
            "female": "en-US-AriaNeural",
            "neutral": "en-US-JennyNeural"
        }
        
        # Get voice based on language and voice type
        if request.script_data.language.startswith("hi"):
            voice = "hi-IN-SwaraNeural"
        else:
            voice = VOICE_MAP.get(request.script_data.voice_type, "en-US-AriaNeural")
        
        # Create target directory
        target_dir = f"app/static/{slug}"
        os.makedirs(target_dir, exist_ok=True)
        
        # Generate audio for each flow item
        for item in request.script_data.flow:
            file_path = os.path.join(target_dir, f"{item.key}.mp3")
            
            # Skip if exists
            if os.path.exists(file_path):
                print(f"✅ Exists: {item.key}.mp3")
                continue
            
            try:
                print(f"🎙️ Generating: {item.key}...")
                communicate = edge_tts.Communicate(item.text, voice)
                await communicate.save(file_path)
                print(f"✅ Generated: {item.key}.mp3")
            except Exception as e:
                print(f"❌ Error generating {item.key}: {e}")
        
        return {
            "success": True,
            "message": f"Audio files generated for {slug}",
            "voice_used": voice
        }
    except Exception as e:
        print(f"❌ Error generating audio: {e}")
        raise HTTPException(status_code=500, detail=str(e))
