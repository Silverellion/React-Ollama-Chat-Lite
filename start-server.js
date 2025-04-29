const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Configuration
const EXPRESS_PORT = 3000;
const CLOUDFLARED_TUNNEL = process.env.CLOUDFLARE_TUNNEL_HOSTNAME;

// Start Express server
function startExpressServer() {
  console.log("Starting Express server...");

  const serverProcess = spawn(
    "node",
    [path.join(__dirname, "dist", "server", "index.js")],
    {
      stdio: "inherit",
    }
  );

  serverProcess.on("error", (err) => {
    console.error("Failed to start Express server:", err);
  });

  return serverProcess;
}

// Start Cloudflared tunnel
function startCloudflared() {
  if (!CLOUDFLARED_TUNNEL) {
    console.warn(
      "CLOUDFLARE_TUNNEL_HOSTNAME not set in .env, skipping cloudflared"
    );
    return null;
  }

  console.log(`Starting Cloudflared tunnel for ${CLOUDFLARED_TUNNEL}...`);

  const cloudflaredProcess = spawn(
    "cloudflared",
    ["tunnel", "--url", `http://localhost:${EXPRESS_PORT}`],
    {
      stdio: "inherit",
    }
  );

  cloudflaredProcess.on("error", (err) => {
    if (err.code === "ENOENT") {
      console.error(
        "Cloudflared not found. Please install it from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/"
      );
    } else {
      console.error("Failed to start Cloudflared:", err);
    }
  });

  return cloudflaredProcess;
}

// Handle process termination
function setupProcessHandlers(processes) {
  const cleanup = () => {
    console.log("Shutting down servers...");
    processes.forEach((proc) => {
      if (proc && !proc.killed) {
        proc.kill();
      }
    });
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("exit", cleanup);
}

function main() {
  console.log("Starting services...");

  const processes = [];

  // Start Express server
  const expressProcess = startExpressServer();
  if (expressProcess) processes.push(expressProcess);

  // Give Express server time to start before connecting Cloudflared
  setTimeout(() => {
    const cloudflaredProcess = startCloudflared();
    if (cloudflaredProcess) processes.push(cloudflaredProcess);

    console.log("All services started!");
    console.log(`Server running at http://localhost:${EXPRESS_PORT}`);
    if (CLOUDFLARED_TUNNEL) {
      console.log(`Cloudflare tunnel running at https://${CLOUDFLARED_TUNNEL}`);
    }
  }, 2000);

  // Setup clean shutdown
  setupProcessHandlers(processes);
}

main();
