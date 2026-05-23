from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.routes import voice, call, calls, audio_management
from app.database import connect_to_mongo, close_mongo_connection


# 🟢 LIFESPAN context manager (Modern FastAPI)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


app = FastAPI(lifespan=lifespan)

# Audio is now served from Cloudinary — no local StaticFiles mount needed.

app.include_router(voice.router, prefix="/voice")
app.include_router(call.router)
app.include_router(calls.router, prefix="/calls")
app.include_router(audio_management.router, prefix="/calls")