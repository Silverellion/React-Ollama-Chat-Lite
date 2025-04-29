import { Ollama } from "ollama";
import type { Message } from "ollama";

export class OllamaMemoryManager {
  private static conversations: Map<string, Message[]> = new Map();
  private static systemMessage =
    process.env.SYSTEM_MESSAGE || "You are an AI assistant.";

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
