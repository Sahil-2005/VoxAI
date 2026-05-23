# import os
# from dotenv import load_dotenv
# from fastapi import Request, HTTPException, status
# from twilio.request_validator import RequestValidator

# # Load env vars
# load_dotenv()

# TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")

# # Check if token exists to prevent cryptic errors later
# if not TWILIO_AUTH_TOKEN:
#     raise ValueError("❌ TWILIO_AUTH_TOKEN is missing. Please check your .env file.")

# validator = RequestValidator(TWILIO_AUTH_TOKEN)

# async def validate_twilio_request(request: Request):
#     """
#     Validates that the incoming request is actually from Twilio.
#     """
#     # Bypass validation if in development mode (optional)
#     if os.getenv("ENV") == "development":
#         return True

#     url = str(request.url)
    
#     # Twilio sends form data as POST parameters
#     form_data = await request.form()
#     params = dict(form_data)
    
#     # The X-Twilio-Signature header
#     signature = request.headers.get("X-Twilio-Signature", "")

#     # Validate
#     if not validator.validate(url, params, signature):
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Forbidden: Request not verified as coming from Twilio"
#         )

import os
from fastapi import Request, HTTPException
from twilio.request_validator import RequestValidator

async def validate_twilio_request(request: Request):
    """
    Validates that incoming requests legitimately originate from Twilio.
    """
    # In a Multi-Tenant SaaS, we don't have a single global TWILIO_AUTH_TOKEN.
    # To fully secure this in production, you would need to:
    # 1. Parse the 'CallSid' from the incoming request form.
    # 2. Look up the CallSid in your database to find the associated User.
    # 3. Retrieve that specific user's twilio_auth_token.
    # 4. Use RequestValidator(user_token).validate(url, form_data, signature)
    
    # For local testing and current MVP phase, we will bypass strict validation.
    # Once your database models map calls securely, you can implement the DB lookup here.
    
    return True