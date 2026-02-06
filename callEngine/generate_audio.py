import os
import json
import asyncio
import edge_tts
import glob

# For English bot, use English voice
VOICE_MAP = {
    "agrosathi": "hi-IN-SwaraNeural",  # Hindi voice
    "projectmanager": "en-US-AriaNeural"  # English voice
}

BASE_STATIC_DIR = "app/static"
SCRIPTS_DIR = "app/scripts"

async def generate_mp3s():
    # Find all JSON files in the scripts folder
    script_files = glob.glob(f"{SCRIPTS_DIR}/*.json")
    
    if not script_files:
        print(f"⚠️ No script files found in {SCRIPTS_DIR}")
        return

    for script_file in script_files:
        print(f"\n📂 Processing script: {script_file}...")
        
        with open(script_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        slug = data.get("slug")
        flow = data.get("flow", [])

        if not slug:
            print(f"❌ Skipping {script_file}: No 'slug' found.")
            continue

        # Select appropriate voice based on script slug
        voice = VOICE_MAP.get(slug, "en-US-AriaNeural")
        print(f"   ↳ Using voice: {voice}")

        # Dynamic Folder Creation: app/static/agrosathi
        target_dir = os.path.join(BASE_STATIC_DIR, slug)
        os.makedirs(target_dir, exist_ok=True)
        print(f"   ↳ Target Folder: {target_dir}")

        for item in flow:
            key = item["key"]
            text = item["text"]
            file_path = os.path.join(target_dir, f"{key}.mp3")
            
            # Check if file exists to save time (optional)
            if os.path.exists(file_path):
                 print(f"     ✅ Exists: {key}.mp3")
                 continue

            try:
                print(f"     🎙️ Generating: {key}...")
                communicate = edge_tts.Communicate(text, voice)
                await communicate.save(file_path)
            except Exception as e:
                print(f"     ❌ Error generating {key}: {e}")

if __name__ == "__main__":
    asyncio.run(generate_mp3s())