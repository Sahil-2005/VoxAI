import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

# NOTE: No global Client() here. Credentials are supplied per-request
# so every tenant uses their own Twilio account.


def make_call(
    to_number: str,
    script_slug: str,
    twilio_sid: str,
    twilio_token: str,
    from_phone: str,
) -> str:
    """
    Initialise a Twilio client from caller-supplied credentials and place
    an outbound call that webhooks back into the callEngine voice flow.

    Args:
        to_number:    Destination phone number (E.164 format, e.g. +919876543210)
        script_slug:  The bot slug that identifies which voice script to run
        twilio_sid:   Caller's Twilio Account SID
        twilio_token: Caller's Twilio Auth Token
        from_phone:   Caller's Twilio phone number (E.164 format)

    Returns:
        The Twilio Call SID string
    """
    # Build client dynamically — no global state, fully multi-tenant
    client = Client(twilio_sid, twilio_token)

    base_url = os.getenv("BASE_URL", "").rstrip("/")
    webhook_url = f"{base_url}/voice/start?script={script_slug}"

    print(f"📞 Calling {to_number} | script={script_slug} | from={from_phone}")
    print(f"   ↳ Webhook: {webhook_url}")

    call = client.calls.create(
        to=to_number,
        from_=from_phone,
        url=webhook_url,
    )

    print(f"   ✅ Call SID: {call.sid}")
    return call.sid