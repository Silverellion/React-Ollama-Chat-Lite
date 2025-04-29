const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Check if dotenv is installed
try {
  require("dotenv").config();
} catch (e) {
  console.warn(
    "dotenv module not found. Proceeding without loading .env file."
  );
}

// Configuration
const EXPRESS_PORT = process.env.PORT || 3000;
const CLOUDFLARED_TUNNEL = process.env.CLOUDFLARE_TUNNEL_HOSTNAME;

console.log("Starting Express server...");

// Check if the server file exists
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

// Keep the process running
console.log("Server running! Press Ctrl+C to stop.");
