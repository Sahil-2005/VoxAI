import os
import httpx
from typing import Dict, Any

async def send_call_completion_webhook(call_sid: str, responses: Dict[str, str], duration: int = 0, status: str = "completed"):
    """
    Send webhook notification to Node.js server when call completes
    
    Args:
        call_sid: Twilio call SID
        responses: Dictionary of question keys and user answers
        duration: Call duration in seconds
        status: Call status (completed, failed, etc.)
    """
    try:
        node_server_url = os.getenv("NODE_SERVER_URL", "http://localhost:5000")
        webhook_url = f"{node_server_url}/api/webhooks/call-completed"
        
        payload = {
            "callSid": call_sid,
            "responses": responses,
            "duration": duration,
            "status": status
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(webhook_url, json=payload)
            
            if response.status_code == 200:
                print(f"✅ Webhook sent successfully for call {call_sid}")
                return True
            else:
                print(f"⚠️ Webhook failed with status {response.status_code}: {response.text}")
                return False
                
    except Exception as e:
        print(f"❌ Error sending webhook for call {call_sid}: {e}")
        return False
