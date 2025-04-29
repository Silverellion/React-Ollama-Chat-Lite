import { Router } from "express";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { detectLanguage } from "../utils/languageDetection";

const router = Router();

// Handle TTS requests
router.post("/", async (req, res) => {
  try {
    const { text, language = "auto" } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Use language detection if 'auto' is specified
    let lang = language;
    if (language === "auto") {
      lang = detectLanguage(text);
    }

    // Path to Python script - adjust for Windows paths
    const scriptPath = path.join(__dirname, "..", "coquiTTS", "main.py");

    // Make sure Python script exists
    if (!fs.existsSync(scriptPath)) {
      console.error("TTS script not found at:", scriptPath);
      return res
        .status(500)
        .json({ error: "TTS service not configured properly" });
    }

    // Log the command we're about to run
    console.log(
      `Generating TTS for text (${lang}): ${text.substring(0, 50)}${
        text.length > 50 ? "..." : ""
      }`
    );

    // Run the Python script with Windows compatibility
    const pythonProcess = spawn(
      "python",
      [scriptPath, "--text", text, "--lang", lang, "--json"],
      {
        windowsHide: true, // Hide the command window on Windows
      }
    );

    let result = "";
    let error = "";

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
      console.error("TTS process error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("TTS process failed with code:", code);
        console.error("Error output:", error);
        return res.status(500).json({ error: "Failed to generate speech" });
      }

      try {
        // Parse the output
        const output = JSON.parse(result);

        if (!output.success) {
          console.error("TTS generation failed:", output.error);
          return res
            .status(500)
            .json({ error: output.error || "Unknown error" });
        }

        // Send the file
        const filePath = output.file_path;
        console.log(`Sending TTS file: ${filePath}`);

        res.sendFile(filePath, {}, (err) => {
          if (err) {
            console.error("Error sending TTS file:", err);
          }
        });
      } catch (parseError) {
        console.error("Error parsing TTS output:", parseError);
        console.error("Raw output:", result);
        return res.status(500).json({ error: "Failed to process TTS output" });
      }
    });
  } catch (error) {
    console.error("Error in TTS route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
