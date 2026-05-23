from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.twilio_client import make_call

router = APIRouter()


class CallRequest(BaseModel):
    """
    All fields required to place a single outbound call.
    Credentials are supplied by the caller (Node.js server) and are never
    read from environment variables, making this endpoint fully multi-tenant.
    """
    to_phone: str = Field(..., description="Destination phone number in E.164 format (e.g. +919876543210)")
    script: str = Field(..., description="Bot slug that identifies the voice script to run")
    twilio_sid: str = Field(..., description="Caller's Twilio Account SID")
    twilio_auth_token: str = Field(..., description="Caller's Twilio Auth Token")
    twilio_from_phone: str = Field(..., description="Caller's Twilio phone number in E.164 format")


@router.post("/call")
async def trigger_call(body: CallRequest):
    """
    Trigger an outbound call using the caller-supplied Twilio credentials.

    The FastAPI server does NOT use any global Twilio environment variables
    for placing calls — every request is executed under the tenant's own
    Twilio account.
    """
    try:
        sid = make_call(
            to_number=body.to_phone,
            script_slug=body.script,
            twilio_sid=body.twilio_sid,
            twilio_token=body.twilio_auth_token,
            from_phone=body.twilio_from_phone,
        )
        return {
            "status": "calling",
            "call_sid": sid,
            "script": body.script,
            "to": body.to_phone,
        }
    except Exception as e:
        # Surface Twilio / network errors clearly so the Node.js layer
        # can pass a meaningful message back to the client
        print(f"❌ Error placing call: {e}")
        raise HTTPException(status_code=500, detail=str(e))