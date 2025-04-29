interface TTSOptions {
  language?: string | null;
  voice?: string;
}

// Audio context for handling the audio playback
let audioContext: AudioContext | null = null;
let audioSource: AudioBufferSourceNode | null = null;

export class TTSService {
  private static instance: TTSService;
  private isPlaying: boolean = false;
  private abortController: AbortController | null = null;

  private constructor() {}

  public static getInstance(): TTSService {
    if (!TTSService.instance) {
      TTSService.instance = new TTSService();
    }
    return TTSService.instance;
  }

  public async speak(text: string, options: TTSOptions = {}): Promise<void> {
    if (!text) return;

    this.stop();

    this.abortController = new AbortController();

    try {
      this.isPlaying = true;
      const apiUrl =
        typeof window !== "undefined" &&
        window.location.hostname !== "localhost"
          ? `${window.location.origin}/api/tts` // When deployed with Cloudflare
          : "http://localhost:3000/api/tts"; // For local development

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          language: options.language || "auto",
          voice: options.voice || "default",
        }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }
      const audioData = await response.arrayBuffer();

      // Create audio context if it doesn't exist
      if (!audioContext) {
        audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      const audioBuffer = await audioContext.decodeAudioData(audioData);
      audioSource = audioContext.createBufferSource();
      audioSource.buffer = audioBuffer;
      audioSource.connect(audioContext.destination);

      // Play the audio and set up event listeners
      audioSource.start();

      audioSource.onended = () => {
        this.isPlaying = false;
        audioSource = null;
      };
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("TTS error:", error);
        // fall back to browser's speech synthesis here
      }
      this.isPlaying = false;
    }
  }

  public stop(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    if (audioSource) {
      try {
        audioSource.stop();
      } catch (e) {
        // Ignore errors from stopping already stopped sources
      }
      audioSource = null;
    }

    this.isPlaying = false;
  }

  public isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}
