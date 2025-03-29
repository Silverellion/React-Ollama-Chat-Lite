import { OllamaMemoryManager } from "./Ollama/OllamaMemoryManager";

export type SavedChat = {
  id: string;
  name: string;
  messages: ChatMessage[];
};

export type ChatMessage = {
  text: string;
  isUser: boolean;
  image?: string | string[];
};

export class ChatManager {
  private static instance: ChatManager;
  private currentChatId: string | null = null;
  private savedChats: SavedChat[] = [];

  private constructor() {}

  public static getInstance(): ChatManager {
    if (!ChatManager.instance) {
      ChatManager.instance = new ChatManager();
    }
    return ChatManager.instance;
  }

  public getCurrentChatId(): string | null {
    return this.currentChatId;
  }

  public getSavedChats(): SavedChat[] {
    return this.savedChats;
  }

  public handleUserInput(
    text: string,
    currentMessages: ChatMessage[],
    imageData?: string | string[] | null
  ) {
    const newMessage: ChatMessage = {
      text: text,
      isUser: true,
      image: imageData || undefined,
    };

    // Create a new chat if none exists
    if (this.currentChatId) {
      const chatIndex = this.savedChats.findIndex(
        (chat) => chat.id === this.currentChatId
      );
      if (chatIndex !== -1) {
        this.savedChats[chatIndex].messages.push(newMessage);
      }
    } else {
      const newChat: SavedChat = {
        id: this.addUserMessage(text, imageData),
        name: text ? text : "New chat",
        messages: [newMessage],
      };
      this.savedChats.unshift(newChat);
      this.currentChatId = newChat.id;
    }

    return {
      newMessages: [...currentMessages, newMessage],
      savedChats: this.getSavedChats(),
    };
  }

  public handleUserInputWithImage(
    text: string,
    imageData: string | string[],
    currentMessages: ChatMessage[]
  ) {
    const newMessage: ChatMessage = {
      text: text || "",
      isUser: true,
      image: imageData,
    };

    if (this.currentChatId) {
      const chatIndex = this.savedChats.findIndex(
        (chat) => chat.id === this.currentChatId
      );
      if (chatIndex !== -1) {
        this.savedChats[chatIndex].messages.push(newMessage);
      }
    } else {
      const newChat: SavedChat = {
        id: this.addUserMessage(text, imageData),
        name: text ? text : "Chat with image",
        messages: [newMessage],
      };
      this.savedChats.unshift(newChat);
      this.currentChatId = newChat.id;
    }

    return {
      newMessages: [...currentMessages, newMessage],
      savedChats: this.getSavedChats(),
    };
  }

  public handleNewChat() {
    this.createNewChat();
    return {
      newMessages: [],
      savedChats: this.getSavedChats(),
    };
  }

  public handleLoadChat(chatId: string) {
    const loadedChat = this.loadChat(chatId);
    return {
      newMessages: loadedChat?.messages || [],
      savedChats: this.getSavedChats(),
    };
  }

  public handleRenameChat(chatId: string, newName: string) {
    this.savedChats = this.savedChats.map((chat) =>
      chat.id === chatId ? { ...chat, name: newName } : chat
    );
    return { savedChats: this.getSavedChats() };
  }

  public handleDeleteChat(chatId: string) {
    const isCurrentChat = chatId === this.currentChatId;
    if (isCurrentChat) {
      OllamaMemoryManager.clearMemory(chatId);
      this.createNewChat();
    }
    this.savedChats = this.savedChats.filter((chat) => chat.id !== chatId);
    return {
      newMessages: [],
      savedChats: this.getSavedChats(),
      isCurrentChat,
    };
  }

  public updateWithAIResponse(
    response: string,
    currentMessages: ChatMessage[]
  ) {
    this.updateChatWithAIResponse(response);
    return {
      newMessages: [...currentMessages, { text: response, isUser: false }],
      savedChats: this.getSavedChats(),
    };
  }

  public setSavedChats(chats: SavedChat[]): void {
    this.savedChats = chats;
  }

  public createNewChat(): void {
    if (this.currentChatId) {
      OllamaMemoryManager.clearMemory(this.currentChatId);
    }
    this.currentChatId = null;
  }

  public loadChat(chatId: string): SavedChat | null {
    const chatToLoad = this.savedChats.find((chat) => chat.id === chatId);
    if (!chatToLoad) return null;
    if (this.currentChatId) {
      OllamaMemoryManager.clearMemory(this.currentChatId);
    }
    this.currentChatId = chatId;
    this.rebuildMemoryFromMessages(chatId, chatToLoad.messages);
    return chatToLoad;
  }

  public addUserMessage(
    text: string,
    imageData?: string | string[] | null
  ): string {
    if (!this.currentChatId) {
      const newChatId = Date.now().toString();
      this.currentChatId = newChatId;

      return newChatId;
    }

    this.savedChats = this.savedChats.map((chat) =>
      chat.id === this.currentChatId
        ? {
            ...chat,
            messages: [
              ...chat.messages,
              {
                text,
                isUser: true,
                image: imageData || undefined,
              },
            ],
          }
        : chat
    );
    return this.currentChatId;
  }

  public updateChatWithAIResponse(response: string): void {
    if (this.currentChatId) {
      this.savedChats = this.savedChats.map((chat) =>
        chat.id === this.currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, { text: response, isUser: false }],
            }
          : chat
      );
    }
  }

  private rebuildMemoryFromMessages(
    chatId: string,
    messages: ChatMessage[]
  ): void {
    OllamaMemoryManager.clearMemory(chatId);
    OllamaMemoryManager.rebuildConversation(chatId, messages);
  }
}
// Updated on 2025-02-11 16:57:51
// Updated on 2025-02-15 00:53:54
// Updated on 2025-02-20 02:00:17
// Updated on 2025-04-15 22:39:04
// Updated on 2023-03-27 16:14:41
// Updated on 2023-05-12 02:19:00
// Updated on 2023-06-20 13:55:29
// Updated on 2023-10-06 04:23:27
// Updated on 2023-10-14 08:19:33
// Updated on 2023-12-02 07:26:23
// Updated on 2025-02-06 06:00:13
// Updated on 2025-02-12 00:30:43
// Updated on 2025-02-18 14:10:44
// Updated on 2025-02-26 15:39:45
// Updated on 2025-03-03 16:24:29
// Updated on 2025-03-04 06:39:13
// Updated on 2025-03-07 07:38:43
// Updated on 2025-03-08 06:46:27
// Updated on 2025-03-12 22:12:06
// Updated on 2025-03-14 18:22:13
// Updated on 2025-03-18 21:33:53
// Updated on 2025-04-03 02:07:12
// Updated on 2025-04-03 01:06:25
// Updated on 2025-02-14 09:32:07
// Updated on 2025-02-22 23:53:17
// Updated on 2025-03-04 00:02:45
// Updated on 2025-03-04 00:41:08
// Updated on 2025-03-07 17:48:19
// Updated on 2025-03-12 18:11:51
// Updated on 2025-03-12 10:18:11
// Updated on 2025-03-12 06:51:28
// Updated on 2025-03-20 06:07:57
// Updated on 2025-03-26 09:29:04
// Updated on 2025-03-30 02:41:58
