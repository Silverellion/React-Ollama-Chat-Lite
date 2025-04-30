from fastapi import FastAPI, Request, Response
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from main import generate_speech

app = FastAPI()

# Allow CORS for local dev and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/tts")
async def tts_endpoint(request: Request):
    data = await request.json()
    text = data.get("text", "")
    lang = data.get("language", "en")
    if not text:
        return {"error": "No text provided"}, 400
    try:
        wav_path = generate_speech(text, lang)
        return FileResponse(wav_path, media_type="audio/wav")
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)