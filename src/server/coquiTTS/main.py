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

def detect_language(text):
    """Detect the language of the input text."""
    if not text:
        return "en"
    
    # Check for Japanese characters (Hiragana, Katakana, Kanji)
    if re.search(r'[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]', text):
        return "ja"
    
    # Check for German characters and common German words
    if re.search(r'[äöüßÄÖÜ]', text):
        return "de"
        
    # Check for common German words if it's a longer text
    german_words = ["und", "der", "die", "das", "ist", "ich", "du", "wir", "sie", "nicht", 
                   "ein", "eine", "zu", "für", "mit", "dem", "den", "wie", "aber", "oder", 
                   "wenn", "dann", "auch", "schon", "noch", "nur", "so", "da", "hier"]
    
    word_count = 0
    for word in german_words:
        if re.search(r'\b' + word + r'\b', text.lower()):
            word_count += 1
    
    # If multiple German words are found and text is reasonably long
    if word_count >= 2 and len(text.split()) > 3:
        return "de"
    return "en" 

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