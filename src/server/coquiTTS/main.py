import logging
import time
import re
import os
import threading
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
        "speaker": "p226",  
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

_tts_instances = {}
_tts_lock = threading.Lock()
_last_request = {"text": "", "timestamp": 0}
_cooldown = 2  # seconds

def generate_speech(text, lang="en", output_path=None):
    global _last_request
    
    try:
        current_time = time.time()
        
        with _tts_lock:
            _last_request["text"] = text
            _last_request["timestamp"] = current_time
            
            if lang not in AVAILABLE_MODELS:
                lang = "en" 
                
            logger.info(f"TTS input after cleaning: '{text}'")
            
            if not text.strip() or len(text.strip()) < 3:
                raise ValueError("Text too short or unsupported for TTS.")
                
            model_info = AVAILABLE_MODELS[lang]
            tts_model = model_info["tts_model"]
            speaker = model_info.get("speaker")
            
            if tts_model not in _tts_instances:
                _tts_instances[tts_model] = TTS(tts_model)
            tts = _tts_instances[tts_model]
            
            # Generate a unique output file path if none provided
            if output_path is None:
                output_path = OUTPUT_DIR / f"tts_{int(time.time())}.wav"
            
            tts.tts_to_file(text=text, speaker=speaker, speed=1.5, file_path=str(output_path))
            
            return str(output_path)
    except Exception as e:
        logger.error(f"Error generating speech: {e}")
        raise