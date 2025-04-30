import { detectLanguage } from "./LanguageDetection";

export class TTSService {
  private static instance: TTSService;
  private audio: HTMLAudioElement | null = null;
  private lastRequestText: string = "";
  private lastRequestTime: number = 0;
  private requestInProgress: boolean = false;

  static getInstance(): TTSService {
    if (!TTSService.instance) {
      TTSService.instance = new TTSService();
    }
    return TTSService.instance;
  }

  async speak(text: string) {
    // Don't make duplicate requests within 2 seconds
    const now = Date.now();
    if (
      this.requestInProgress ||
      (text === this.lastRequestText && now - this.lastRequestTime < 2000)
    ) {
      console.log("Skipping duplicate TTS request");
      return;
    }

    this.lastRequestText = text;
    this.lastRequestTime = now;
    this.requestInProgress = true;

    // Detect language from text
    const language = detectLanguage(text);
    console.log(
      `Detected language: ${language} for text: ${text.substring(0, 50)}...`
    );

    const apiUrl =
      typeof window !== "undefined" && window.location.hostname !== "localhost"
        ? `${window.location.origin}/api/tts`
        : "http://localhost:3000/api/tts";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) {
        throw new Error("TTS server error");
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }
      this.audio = new Audio(audioUrl);
      this.audio.play();
    } catch (error) {
      console.error("TTS error:", error);
    } finally {
      this.requestInProgress = false;
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
}
