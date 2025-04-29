@echo off
echo Starting Ollama Assistant with TTS...

REM Check if start-server.js exists
if not exist "start-server.js" (
  echo Error: start-server.js not found.
  echo Creating a simple version of the file...
  
  echo const { spawn } = require('child_process'); > start-server.js
  echo const path = require('path'); >> start-server.js
  echo const fs = require('fs'); >> start-server.js
  echo. >> start-server.js
  echo console.log('Starting Express server...'); >> start-server.js
  echo. >> start-server.js
  echo const serverProcess = spawn('node', [ >> start-server.js
  echo   path.join(__dirname, 'dist', 'server', 'index.js') >> start-server.js
  echo ], { >> start-server.js
  echo   stdio: 'inherit' >> start-server.js
  echo }); >> start-server.js
  echo. >> start-server.js
  echo serverProcess.on('error', (err) => { >> start-server.js
  echo   console.error('Failed to start Express server:', err); >> start-server.js
  echo }); >> start-server.js
  echo. >> start-server.js
  echo console.log('Server started! Press Ctrl+C to stop.'); >> start-server.js
  
  echo Created start-server.js file!
)

REM Build the project first
call npm run build

REM Start the server
echo Starting the server...
node start-server.js

REM Keep the window open if there's an error
if %errorlevel% neq 0 (
  echo An error occurred when starting the server.
  echo Press any key to exit...
  pause > nul
)