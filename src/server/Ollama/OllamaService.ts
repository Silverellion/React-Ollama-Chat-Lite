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
// Updated on 2025-03-07 12:16:18
// Updated on 2025-04-05 19:57:32
// Updated on 2025-04-07 01:00:17
// Updated on 2025-04-18 05:40:00
// Updated on 2023-04-02 22:23:28
// Updated on 2023-04-26 18:00:25
// Updated on 2023-04-26 06:12:32
// Updated on 2023-06-09 16:04:50
// Updated on 2023-06-25 05:10:31
// Updated on 2023-08-08 00:16:00
// Updated on 2023-08-16 01:45:06
// Updated on 2025-02-11 15:01:23
// Updated on 2025-02-18 20:09:15
// Updated on 2025-02-26 11:36:47
// Updated on 2025-02-27 04:30:11
// Updated on 2025-03-08 14:17:35
// Updated on 2025-03-12 12:59:36
// Updated on 2025-03-24 18:00:38
// Updated on 2025-04-02 06:12:26
// Updated on 2025-04-04 14:44:37
// Updated on 2025-04-09 02:14:31
// Updated on 2025-02-12 09:19:56
// Updated on 2025-02-14 16:08:39
