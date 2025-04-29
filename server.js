const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

try {
  require("dotenv").config();
} catch (e) {
  console.warn(
    "dotenv module not found. Proceeding without loading .env file."
  );
}

const EXPRESS_PORT = process.env.PORT || 3000;

console.log("Starting Express server...");

const serverFilePath = path.join(__dirname, "dist", "server", "index.js");
if (!fs.existsSync(serverFilePath)) {
  console.error(`Error: Server file not found at ${serverFilePath}`);
  console.error("Make sure to build the project properly before starting.");
  process.exit(1);
}

// Start the server
const serverProcess = spawn("node", [serverFilePath], {
  stdio: "inherit",
});

serverProcess.on("error", (err) => {
  console.error("Failed to start Express server:", err);
});

console.log("Server running! Press Ctrl+C to stop.");
