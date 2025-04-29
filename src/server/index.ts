import express from "express";
import cors from "cors";
import { createServer } from "http";
import ttsRouter from "./routes/tts";

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

console.log("Starting Express server...");

// API routes
app.use("/api/tts", ttsRouter);
console.log("TTS route registered at /api/tts");

// Create HTTP server
const server = createServer(app);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`TTS API available at: http://localhost:${PORT}/api/tts`);
});

export default app;
