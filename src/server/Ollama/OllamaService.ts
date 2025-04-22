import { OllamaMemoryManager } from "./OllamaMemoryManager";
import { ChatManager } from "../ChatManager";

const baseUrl =
  typeof window !== "undefined"
    ? window.location.origin + "/api/ollama"
    : "http://localhost:5173" + "/api/ollama";

export default async function OllamaResponse(
  prompt: string,
  streamHandler: ((text: string) => void) | null = null,
  model: string = "gemma3",
  imageData?: string | string[]
) {
  const chatManager = ChatManager.getInstance();
  const memoryId = chatManager.getCurrentChatId() || "temp-" + Date.now();

  return await OllamaMemoryManager.chat(
    memoryId,
    prompt,
    model,
    baseUrl,
    streamHandler || undefined,
    imageData
  );
}
