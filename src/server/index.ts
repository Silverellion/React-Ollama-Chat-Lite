import express from "express";
import cors from "cors";
import ttsRouter from "./routes/tts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/tts", ttsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`TTS API available at: http://localhost:${PORT}/api/tts`);
});
