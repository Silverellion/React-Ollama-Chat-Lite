@echo off
echo Starting Ollama Assistant with TTS...

REM Build the server only (skip client build which has React Markdown issues)
call npm run build:server

REM Start the server with CommonJS
echo Starting the server...
set NODE_OPTIONS=--no-warnings
node dist/server/index.js

REM Keep the window open if there's an error
if %errorlevel% neq 0 (
  echo An error occurred when starting the server.
  echo Press any key to exit...
  pause > nul
)