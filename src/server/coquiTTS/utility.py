import os
import logging
import time
from pathlib import Path
import argparse

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def cleanup_old_files(directory, max_age_minutes=30):
    """
    Delete files older than the specified age
    Args:
        directory (str): Directory to clean
        max_age_minutes (int): Maximum age of files in minutes
    """
    directory_path = Path(directory)
    if not directory_path.exists():
        logger.warning(f"Directory does not exist: {directory}")
        return

    current_time = time.time()
    max_age_seconds = max_age_minutes * 60
    
    file_count = 0
    
    for file_path in directory_path.glob("*.wav"):
        try:
            # Get file's last modified time
            file_age = current_time - file_path.stat().st_mtime
            
            # Delete if file is older than max age
            if file_age > max_age_seconds:
                file_path.unlink()
                file_count += 1
                logger.debug(f"Deleted: {file_path}")
        except Exception as e:
            logger.error(f"Error removing file {file_path}: {e}")
    
    logger.info(f"Cleanup completed: {file_count} files removed")

def main():
    """Run the cleanup utility from command line"""
    parser = argparse.ArgumentParser(description="Clean up old TTS audio files")
    parser.add_argument("--directory", type=str, default=None, 
                      help="Directory containing files to clean (default: output directory)")
    parser.add_argument("--max-age", type=int, default=30, 
                      help="Maximum file age in minutes (default: 30)")
    
    args = parser.parse_args()
    
    # If directory not specified, use default output directory
    if args.directory is None:
        script_dir = Path(__file__).parent.resolve()
        output_dir = script_dir / "output"
        directory = output_dir
    else:
        directory = Path(args.directory)
    
    cleanup_old_files(directory, args.max_age)
    
    return 0

if __name__ == "__main__":
    main()