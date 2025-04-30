import logging
import time
import re
from pathlib import Path
from TTS.api import TTS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SCRIPT_DIR = Path(__file__).parent.resolve()
OUTPUT_DIR = SCRIPT_DIR / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

AVAILABLE_MODELS = {
    "en": {
        "tts_model": "tts_models/en/vctk/vits",
        "speaker": "p225",  
    },
    "de": {
        "tts_model": "tts_models/de/thorsten/vits",
        "speaker": "thorsten",
    },
    "ja": {
        "tts_model": "tts_models/ja/kokoro/vits",
        "speaker": "kokoro", 
    }
}

def clean_text(text):
    text = text.replace("’", "'").replace("“", '"').replace("”", '"')
    text = re.sub(r'[^\x00-\x7F]+', '', text)
    return text

def generate_speech(text, lang="en", output_path=None):
    try:
        text = clean_text(text)
        if not text.strip() or len(text.strip()) < 3:
            raise ValueError("Text too short or unsupported for TTS.")
        model_info = AVAILABLE_MODELS.get(lang, AVAILABLE_MODELS["en"])
        tts_model = model_info["tts_model"]
        speaker = model_info.get("speaker")
        tts = TTS(tts_model)
        if output_path is None:
            output_path = OUTPUT_DIR / f"tts_{int(time.time())}.wav"
        # Try to increase speed if supported (not all models support this)
        tts.tts_to_file(text=text, speaker=speaker, speed=1.3, file_path=str(output_path))
        return str(output_path)
    except Exception as e:
        logger.error(f"Error generating speech: {e}")
        raise