import { Ollama } from "ollama";
import type { Message } from "ollama";

export class OllamaMemoryManager {
  private static conversations: Map<string, Message[]> = new Map();
  private static systemMessage = (import.meta as any).env
    .VITE_OLLAMA_SYSTEM_MESSAGE;

  static async chat(
    memoryId: string,
    userMessage: string,
    model: string,
    customBaseUrl?: string,
    streamHandler?: (content: string) => void,
    imageData?: string | string[]
  ): Promise<string> {
    if (!this.conversations.has(memoryId)) {
      this.conversations.set(memoryId, [
        { role: "system", content: this.systemMessage },
      ]);
    }

    const conversation = this.conversations.get(memoryId)!;

    if (imageData) {
      let images: string[] = [];

      if (Array.isArray(imageData)) {
        images = imageData.map((img) => img.split(",")[1]);
      } else {
        images = [imageData.split(",")[1]];
      }

      conversation.push({
        role: "user",
        content: userMessage || "What's in this image?", // Default prompt if no text provided
        images: images,
      });
    } else {
      conversation.push({ role: "user", content: userMessage });
    }

    const client = customBaseUrl
      ? new Ollama({ host: customBaseUrl })
      : new Ollama();

    let fullResponse = "";

    try {
      if (streamHandler) {
        const response = await client.chat({
          model: model,
          messages: conversation,
          stream: true,
        });

        for await (const part of response) {
          fullResponse += part.message.content;
          streamHandler(fullResponse);
        }
      } else {
        const response = await client.chat({
          model: model,
          messages: conversation,
        });

        fullResponse = response.message.content;
      }

      conversation.push({ role: "assistant", content: fullResponse });
      return fullResponse;
    } catch (error) {
      console.error("Error in chat:", error);
      return "Error communicating with the model. Please try again.";
    }
  }

  static clearMemory(memoryId: string): boolean {
    if (this.conversations.has(memoryId)) {
      this.conversations.delete(memoryId);
      return true;
    }
    return false;
  }

  static clearAllMemories(): void {
    this.conversations.clear();
  }

  static getConversationHistory(memoryId: string): Message[] | null {
    return this.conversations.get(memoryId) || null;
  }

  static rebuildConversation(
    memoryId: string,
    messages: { text: string; isUser: boolean; image?: string | string[] }[]
  ): void {
    const conversation: Message[] = [
      { role: "system", content: this.systemMessage },
    ];

    for (const msg of messages) {
      if (msg.isUser && msg.image) {
        let images: string[] = [];

        if (Array.isArray(msg.image)) {
          images = msg.image.map((img) => img.split(",")[1]);
        } else {
          images = [msg.image.split(",")[1]];
        }

        conversation.push({
          role: "user",
          content: msg.text || "What's in this image?",
          images: images,
        });
      } else {
        conversation.push({
          role: msg.isUser ? "user" : "assistant",
          content: msg.text,
        });
      }
    }

    this.conversations.set(memoryId, conversation);
  }
}
// Updated on 2023-12-01 03:32:42
// Updated on 2024-03-06 08:34:08
// Updated on 2024-08-13 00:44:13
// Updated on 2025-03-18 13:47:25
// Updated on 2023-06-10 23:09:44
// Updated on 2023-08-08 11:33:44
// Updated on 2023-08-08 02:21:21
// Updated on 2023-10-06 10:23:08
// Updated on 2023-12-04 05:33:03
// Updated on 2023-12-07 14:20:45
// Updated on 2025-02-06 07:33:13
// Updated on 2025-02-14 13:01:05
// Updated on 2025-02-20 08:31:34
// Updated on 2025-02-27 23:30:13
// Updated on 2025-02-27 07:15:19
// Updated on 2025-03-03 20:46:31
// Updated on 2025-03-05 17:56:49
// Updated on 2025-03-12 01:23:15
// Updated on 2025-02-06 16:26:23
