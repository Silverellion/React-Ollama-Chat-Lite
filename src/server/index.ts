import express from "express";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import ttsRouter from "./routes/tts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const isProduction = process.env.NODE_ENV === "production";
// Serve static files from the dist directory in production
if (isProduction) {
  app.use(express.static(path.join(__dirname, "../../dist")));
}

// API routes
app.use("/api/tts", ttsRouter);

// Fallback route for SPA in production
if (isProduction) {
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../../dist/index.html"));
  });
}

// Create HTTP server
const server = createServer(app);

// Start server
server.listen(PORT, () => {
  console.log(`⚡️ Server running on port ${PORT}`);
  console.log(`🎙️ TTS API available at: http://localhost:${PORT}/api/tts`);
});

export default server;
