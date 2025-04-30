export class TTSService {
  private static instance: TTSService;

  static getInstance(): TTSService {
    if (!TTSService.instance) {
      TTSService.instance = new TTSService();
    }
    return TTSService.instance;
  }

  // Call this using Python CoquiTTS server
  async speak(text: string, language: string = "en") {
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

      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("TTS error:", error);
    }
  }

  stop() {
    // Implement this if you keep a reference to the Audio instance
  }
}
