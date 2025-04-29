@echo off
echo Starting Ollama Assistant with TTS...

REM Build the project first
call npm run build

REM Start the server with Cloudflared
node start-server.js