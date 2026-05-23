"""
trigger_call.py — local development helper script.

This script is NOT part of the production flow. In production, calls are
triggered by the Node.js server which supplies per-tenant credentials.

For local testing, credentials are read from the .env file.

Usage:
    python trigger_call.py
"""

import os
from dotenv import load_dotenv
from app.twilio_client import make_call

load_dotenv()

# Read from .env for local dev testing only
TWILIO_SID   = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE = os.getenv("TWILIO_PHONE")

if not all([TWILIO_SID, TWILIO_TOKEN, TWILIO_PHONE]):
    raise EnvironmentError(
        "❌ Missing one or more Twilio env vars: "
        "TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE"
    )

# ── Trigger a test call ────────────────────────────────────────────────────────

# Project Management Bot (English)
make_call(
    to_number="+919987247192",
    script_slug="projectmanager",
    twilio_sid=TWILIO_SID,
    twilio_token=TWILIO_TOKEN,
    from_phone=TWILIO_PHONE,
)

# Agrosathi Bot (Hindi) — uncomment to test
# make_call(
#     to_number="+919987247192",
#     script_slug="agrosathi",
#     twilio_sid=TWILIO_SID,
#     twilio_token=TWILIO_TOKEN,
#     from_phone=TWILIO_PHONE,
# )
