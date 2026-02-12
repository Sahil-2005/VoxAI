import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class DeleteAudioRequest(BaseModel):
    keys: List[str]

@router.post("/{slug}/delete-audio")
async def delete_audio_files(slug: str, request: DeleteAudioRequest):
    """Delete audio files for removed questions"""
    try:
        deleted_files = []
        failed_files = []
        
        audio_dir = f"app/static/{slug}"
        
        if not os.path.exists(audio_dir):
            return {
                "message": f"No audio directory found for {slug}",
                "deleted": [],
                "failed": []
            }
        
        for key in request.keys:
            audio_file = f"{audio_dir}/{key}.mp3"
            
            if os.path.exists(audio_file):
                try:
                    os.remove(audio_file)
                    deleted_files.append(f"{key}.mp3")
                except Exception as e:
                    failed_files.append({"file": f"{key}.mp3", "error": str(e)})
            else:
                # File doesn't exist, not an error
                pass
        
        return {
            "message": f"Deleted {len(deleted_files)} audio files",
            "deleted": deleted_files,
            "failed": failed_files
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
