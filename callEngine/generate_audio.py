"""
generate_audio.py — standalone script to pre-generate all TTS audio and
upload it to Cloudinary.

Run from the project root:
    python generate_audio.py

All audio is stored under voxai/{slug}/{key} in Cloudinary so that voice.py
can build deterministic URLs without any extra DB lookups.
"""

import os
import json
import asyncio
import tempfile
import glob
import edge_tts
from dotenv import load_dotenv

load_dotenv()

# ── Voice mapping ──────────────────────────────────────────────────────────────
VOICE_MAP = {
    "agrosathi": "hi-IN-SwaraNeural",       # Hindi voice
    "projectmanager": "en-US-AriaNeural",   # English voice
}

SCRIPTS_DIR = "app/scripts"


async def generate_and_upload():
    # Import here so Cloudinary config is loaded after dotenv
    from app.cloudinary_client import upload_audio

    script_files = glob.glob(f"{SCRIPTS_DIR}/*.json")

    if not script_files:
        print(f"⚠️  No script files found in {SCRIPTS_DIR}")
        return

    for script_file in script_files:
        print(f"\n📂 Processing script: {script_file} ...")

        with open(script_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        slug = data.get("slug")
        flow = data.get("flow", [])

        if not slug:
            print(f"❌ Skipping {script_file}: No 'slug' found.")
            continue

        voice = VOICE_MAP.get(slug, "en-US-AriaNeural")
        print(f"   ↳ Voice   : {voice}")
        print(f"   ↳ Slug    : {slug}")

        for item in flow:
            key  = item["key"]
            text = item["text"]

            try:
                print(f"     🎙️  Generating: {key} ...")

                # Write to a secure temp file then immediately upload
                with tempfile.NamedTemporaryFile(
                    suffix=".mp3", delete=False
                ) as tmp:
                    tmp_path = tmp.name

                communicate = edge_tts.Communicate(text, voice)
                await communicate.save(tmp_path)

                secure_url = await upload_audio(tmp_path, slug, key)
                print(f"     ✅ Uploaded : {key} → {secure_url}")

            except Exception as e:
                print(f"     ❌ Error for {key}: {e}")
            finally:
                # Always clean up the temp file
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)


if __name__ == "__main__":
    asyncio.run(generate_and_upload())