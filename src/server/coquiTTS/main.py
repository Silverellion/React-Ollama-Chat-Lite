import logging
import time
import re
import threading
from pathlib import Path
from TTS.api import TTS
import torch
from TTS.utils.radam import RAdam
import collections

torch.serialization.add_safe_globals([RAdam, collections.defaultdict, dict])

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SCRIPT_DIR = Path(__file__).parent.resolve()
OUTPUT_DIR = SCRIPT_DIR / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

AVAILABLE_MODELS = {
    "en": {
        "tts_model": "tts_models/en/vctk/vits",
        "speaker": "p226",  
    },
    "de": {
        "tts_model": "tts_models/de/thorsten/vits",
        "speaker": None, 
    },
    "ja": {
        "tts_model": "tts_models/ja/kokoro/tacotron2-DDC",
        "speaker": None,
    }
}

_tts_instances = {}
_tts_lock = threading.Lock()
_last_request = {"text": "", "timestamp": 0}
_cooldown = 2  # seconds

def detect_language(text):
    """Very basic language detection for demo purposes."""
    if not text:
        return "en"
    # Japanese
    if re.search(r'[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]', text):
        return "ja"
    # German
    if re.search(r'[äöüßÄÖÜ]', text):
        return "de"
    # Default to English
    return "en"

def clean_input_text(text):
    # Only allow word characters, whitespace, and .!? plus German and Japanese chars
    # Remove all other special characters
    allowed_pattern = r'[^\w\s.!?äöüßÄÖÜぁ-んァ-ン一-龯ー]'
    return re.sub(allowed_pattern, '', text)

def generate_speech(text, lang=None, output_path=None):
    global _last_request

    try:
        current_time = time.time()

        with _tts_lock:
            _last_request["text"] = text
            _last_request["timestamp"] = current_time

            # Auto-detect language if not specified
            if not lang or lang not in AVAILABLE_MODELS:
                detected_lang = detect_language(text)
                logger.info(f"Auto-detected language: {detected_lang} for text: '{text[:50]}...'")
                lang = detected_lang

            if lang not in AVAILABLE_MODELS:
                lang = "en"

            logger.info(f"Using language model: {lang} for TTS")

            # Clean input text
            clean_text = clean_input_text(text)

            # Split into sentences and filter out short/empty ones
            sentences = [s.strip() for s in re.split(r'[.!?]', clean_text) if len(s.strip()) >= 3]
            if not sentences:
                raise ValueError("No valid sentences for TTS after cleaning.")

            # Join back to a single string for TTS
            final_text = ". ".join(sentences)

            model_info = AVAILABLE_MODELS[lang]
            tts_model = model_info["tts_model"]
            speaker = model_info.get("speaker")

            if tts_model not in _tts_instances:
                _tts_instances[tts_model] = TTS(tts_model)
            tts = _tts_instances[tts_model]

            # Generate a unique output file path if none provided
            if output_path is None:
                output_path = OUTPUT_DIR / f"tts_{int(time.time())}.wav"

            tts.tts_to_file(text=final_text, speaker=speaker, speed=1.5, file_path=str(output_path))

            return str(output_path)
    except Exception as e:
        logger.error(f"Error generating speech: {e}")
        raise