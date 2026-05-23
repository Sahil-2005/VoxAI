from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()


class DeleteAudioRequest(BaseModel):
    keys: List[str]


@router.post("/{slug}/delete-audio")
async def delete_audio_files(slug: str, request: DeleteAudioRequest):
    """Delete audio assets from Cloudinary for a given script slug."""
    from app.cloudinary_client import delete_audio

    deleted_files: List[str] = []
    failed_files: List[dict] = []

    for key in request.keys:
        try:
            result = await delete_audio(slug, key)
            # Cloudinary returns {"result": "ok"} on success
            if result.get("result") in ("ok", "not found"):
                deleted_files.append(f"{key}.mp3")
                print(f"🗑️  Deleted from Cloudinary: voxai/{slug}/{key}")
            else:
                failed_files.append({"file": f"{key}.mp3", "error": str(result)})
        except Exception as e:
            failed_files.append({"file": f"{key}.mp3", "error": str(e)})

    return {
        "message": f"Deleted {len(deleted_files)} audio file(s) from Cloudinary",
        "deleted": deleted_files,
        "failed": failed_files,
    }
