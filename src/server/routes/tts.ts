import express, { Request, Response } from "express";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { detectLanguage } from "../utils/languageDetection";

const router = express.Router();

router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { text, language = "auto" } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    let lang = language;
    if (language === "auto") {
      lang = detectLanguage(text);
    }

    const scriptPath = path.join(__dirname, "..", "..", "coquiTTS", "main.py");
    if (!fs.existsSync(scriptPath)) {
      return res
        .status(500)
        .json({ error: "TTS service not configured properly" });
    }

    const pythonProcess = spawn(
      "python",
      [scriptPath, "--text", text, "--lang", lang, "--json"],
      { windowsHide: true }
    );

    let result = "";
    let error = "";

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return res
          .status(500)
          .json({ error: error || "Failed to generate speech" });
      }
      try {
        const output = JSON.parse(result);
        if (!output.success) {
          return res
            .status(500)
            .json({ error: output.error || "Unknown error" });
        }
        res.sendFile(output.file_path, {}, (err) => {
          if (err) {
            console.error("Error sending TTS file:", err);
          }
        });
      } catch (e) {
        return res.status(500).json({ error: "Failed to process TTS output" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
