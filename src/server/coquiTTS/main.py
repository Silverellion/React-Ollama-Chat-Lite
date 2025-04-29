import os
import sys
import argparse
import logging
import json
from pathlib import Path
from TTS.utils.manage import ModelManager
from TTS.utils.synthesizer import Synthesizer

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set default model paths based on this script's location
SCRIPT_DIR = Path(__file__).parent.resolve()
OUTPUT_DIR = SCRIPT_DIR / "output"
MODELS_DIR = SCRIPT_DIR / "models"

# Ensure directories exist
OUTPUT_DIR.mkdir(exist_ok=True)
MODELS_DIR.mkdir(exist_ok=True)

# Define available models - expand this list as needed
AVAILABLE_MODELS = {
    "en": {
        "tts_model": "tts_models/en/ljspeech/tacotron2-DDC",
        "vocoder_model": "vocoder_models/universal/libri-tts/fullband-melgan"
    },
    "de": {
        "tts_model": "tts_models/de/thorsten/tacotron2-DDC",
        "vocoder_model": "vocoder_models/universal/libri-tts/fullband-melgan"
    },
    "ja": {
        "tts_model": "tts_models/ja/kokoro/tacotron2-DDC",
        "vocoder_model": "vocoder_models/universal/libri-tts/fullband-melgan"
    }
}

def generate_speech(text, lang="en", output_path=None):
    """
    Generate speech from text using Coqui TTS models
    Args:
        text (str): Text to convert to speech
        lang (str): Language code (en, de, ja)
        output_path (str): Optional output path
    Returns:
        str: Path to the generated audio file
    """
    try:
        # Get model details for the requested language or fallback to English
        model_info = AVAILABLE_MODELS.get(lang, AVAILABLE_MODELS["en"])
        tts_model = model_info["tts_model"]
        vocoder_model = model_info["vocoder_model"]

        # Generate a unique filename if not provided
        if not output_path:
            import uuid
            filename = f"{uuid.uuid4()}.wav"
            output_path = OUTPUT_DIR / filename
        else:
            output_path = Path(output_path)

        # Set models paths
        manager = ModelManager(models_dir=str(MODELS_DIR))
        
        # Download models if they don't exist
        model_path, config_path, _ = manager.download_model(tts_model)
        vocoder_path, vocoder_config_path, _ = manager.download_model(vocoder_model)
        
        # Initialize synthesizer
        synthesizer = Synthesizer(
            tts_checkpoint=model_path,
            tts_config_path=config_path,
            vocoder_checkpoint=vocoder_path,
            vocoder_config=vocoder_config_path,
            use_cuda=False  # Set to True if you have a GPU
        )
        
        # Generate the speech
        outputs = synthesizer.tts(text)
        synthesizer.save_wav(outputs, str(output_path))
        
        # Return the path to the generated file
        return str(output_path)
    
    except Exception as e:
        logger.error(f"Error generating speech: {e}")
        raise

def main():
    """Run the TTS generator from command line"""
    parser = argparse.ArgumentParser(description="Generate speech from text using Coqui TTS")
    parser.add_argument("--text", type=str, required=True, help="Text to convert to speech")
    parser.add_argument("--lang", type=str, default="en", choices=["en", "de", "ja"], help="Language")
    parser.add_argument("--output", type=str, help="Output file path")
    parser.add_argument("--json", action="store_true", help="Output JSON format")
    
    args = parser.parse_args()
    
    try:
        output_path = generate_speech(args.text, args.lang, args.output)
        
        if args.json:
            result = {"success": True, "file_path": output_path}
            print(json.dumps(result))
        else:
            print(f"Speech generated successfully: {output_path}")
        
        return 0
    except Exception as e:
        if args.json:
            result = {"success": False, "error": str(e)}
            print(json.dumps(result))
        else:
            print(f"Error: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())