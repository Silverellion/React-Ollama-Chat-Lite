@echo off
echo Setting up CoquiTTS for Windows...

REM Check Python installation
where python >nul 2>&1
if %errorlevel% neq 0 (
  echo Python not found! Please install Python 3.7+ and add it to PATH.
  exit /b 1
)

REM Create directories if they don't exist
if not exist "models" mkdir models
if not exist "output" mkdir output

REM Install requirements
echo Installing Python requirements...
pip install -r requirements.txt
if %errorlevel% neq 0 (
  echo Failed to install requirements.
  exit /b 1
)

echo Setup complete!
echo.
echo To test the TTS functionality, run:
echo   python main.py --text "This is a test of the text to speech system." --lang en
echo.
echo You can add cleanup.bat to Windows Task Scheduler to run every hour.