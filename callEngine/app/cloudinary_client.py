"""
Cloudinary integration for VoxAI callEngine.

All audio assets are stored as:
  voxai/{script_slug}/{key}    (no file extension — Cloudinary handles that)

Public URLs follow the pattern:
  https://res.cloudinary.com/<cloud>/video/upload/voxai/{slug}/{key}.mp3
"""

import os
import asyncio
import cloudinary
import cloudinary.uploader
import cloudinary.api
from dotenv import load_dotenv

load_dotenv()

# ── Initialise once at import time ────────────────────────────────────────────
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,          # always https
)


# ── Helpers ───────────────────────────────────────────────────────────────────

def get_public_id(script_slug: str, key: str) -> str:
    """Return the deterministic Cloudinary public_id for a given audio key."""
    return f"voxai/{script_slug}/{key}"


def get_audio_url(script_slug: str, key: str) -> str:
    """
    Return the CDN URL for an audio asset without hitting the Cloudinary API.
    Cloudinary stores audio under the 'video' resource type.
    """
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    public_id = get_public_id(script_slug, key)
    return f"https://res.cloudinary.com/{cloud_name}/video/upload/{public_id}.mp3"


async def upload_audio(local_path: str, script_slug: str, key: str) -> str:
    """
    Upload a local MP3 file to Cloudinary and return its secure URL.

    Uses overwrite=True so re-running generate_audio for the same script is
    idempotent (the existing asset is simply replaced with the freshest version).

    Cloudinary's Python SDK is synchronous, so we run it in a thread pool to
    avoid blocking the FastAPI event loop.
    """
    public_id = get_public_id(script_slug, key)

    def _upload():
        result = cloudinary.uploader.upload(
            local_path,
            resource_type="video",   # Cloudinary uses "video" for audio files
            public_id=public_id,
            overwrite=True,
            invalidate=True,         # purge CDN cache on overwrite
            format="mp3",
        )
        return result.get("secure_url", "")

    loop = asyncio.get_event_loop()
    secure_url = await loop.run_in_executor(None, _upload)
    return secure_url


async def delete_audio(script_slug: str, key: str) -> dict:
    """
    Delete an audio asset from Cloudinary.
    Returns the raw Cloudinary API response dict.
    """
    public_id = get_public_id(script_slug, key)

    def _destroy():
        return cloudinary.uploader.destroy(public_id, resource_type="video")

    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, _destroy)
    return result


async def delete_audio_folder(script_slug: str) -> dict:
    """
    Delete ALL audio assets for a given script slug (the entire folder).
    Uses Cloudinary's delete_resources_by_prefix API.
    """
    prefix = f"voxai/{script_slug}/"

    def _delete_prefix():
        return cloudinary.api.delete_resources_by_prefix(
            prefix, resource_type="video"
        )

    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, _delete_prefix)
    return result
