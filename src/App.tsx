import { useState, useEffect } from "react";
import { ChatManager, ChatMessage, SavedChat } from "./server/ChatManager";
import "../global.css";
import Sidebar from "./components/Sidebar";
import ChatBubbles from "./components/ChatBubbles";
import GreetingMessage from "./components/GreetingMessage";
import MainTextbox from "./components/MainTextbox";

function App() {
  const chatManager = ChatManager.getInstance();
  const [currentModel, setCurrentModel] = useState<string>("gemma3");
  const [supportsImages, setSupportsImages] = useState<boolean>(true); // Default gemma3 supports images
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [savedChats, setSavedChats] = useState<SavedChat[]>(
    chatManager.getSavedChats()
  );
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [userInput, setUserInput] = useState<{
    dateSent: Date;
    text: string;
    image?: string | string[];
  } | null>(null);

  const handleModelChange = (model: string, supportsImages: boolean) => {
    setCurrentModel(model);
    setSupportsImages(supportsImages);
  };

  useEffect(() => {
    setSavedChats(chatManager.getSavedChats());
    // Initialize isChatStarted based on existing messages
    if (messages.length > 0) {
      setIsChatStarted(true);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setIsChatStarted(true);
    }
  }, [messages]);

  const syncState = (result: any) => {
    if (result.newMessages !== undefined) setMessages(result.newMessages);
    setSavedChats(result.savedChats);
  };

  const handleUserInput = (text: string) => {
    setUserInput({ dateSent: new Date(), text });
    setIsChatStarted(true);
    syncState(chatManager.handleUserInput(text, messages));
  };

  const handleUserImageWithText = (
    imageData: string | string[],
    text: string
  ) => {
    setUserInput({
      dateSent: new Date(),
      text: text,
      image: imageData,
    });

    setIsChatStarted(true);
    syncState(chatManager.handleUserInputWithImage(text, imageData, messages));
  };

  const handleNewChat = () => {
    syncState(chatManager.handleNewChat());
    setUserInput(null);
    setIsChatStarted(false);
  };

  const handleLoadChat = (chatId: string) => {
    syncState(chatManager.handleLoadChat(chatId));
    setIsChatStarted(true);
  };

  const handleDeleteChat = (chatId: string) => {
    const result = chatManager.handleDeleteChat(chatId);
    syncState(result);
    if (result.isCurrentChat) {
      setUserInput(null);
      setIsChatStarted(false);
    }
  };

  const handleRenameChat = (chatId: string, newName: string) => {
    syncState(chatManager.handleRenameChat(chatId, newName));
  };

  return (
    <div className="w-screen h-screen bg-[rgb(30,30,30)] flex">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        savedChats={savedChats}
        onNewChat={handleNewChat}
        onLoadChat={handleLoadChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />
      <div
        className={`flex flex-col transition-all duration-300 w-full ${
          isSidebarCollapsed ? "ml-[20px] mr-[20px]" : "md:ml-[300px] ml-[0px]"
        } ${
          isChatStarted
            ? "items-center justify-end"
            : "items-center justify-center"
        }`}
      >
        {!isChatStarted && <GreetingMessage />}

        <ChatBubbles
          userInput={userInput}
          messages={messages}
          model={currentModel}
          supportsImages={supportsImages}
          onAIResponse={(response) => {
            if (response) {
              syncState(chatManager.updateWithAIResponse(response, messages));
            }
          }}
        />

        <div
          className={`w-full flex justify-center ${
            isChatStarted ? "mt-auto" : "mt-8"
          }`}
        >
          <MainTextbox
            setUserInput={handleUserInput}
            setUserImage={handleUserImageWithText}
            onModelChange={handleModelChange}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
// Updated on 2025-02-09 18:22:52
// Updated on 2025-02-24 04:01:21
// Updated on 2025-03-03 16:01:21
// Updated on 2025-04-20 09:44:00
// Updated on 2023-03-14 00:25:56
// Updated on 2023-03-25 07:42:48
// Updated on 2023-03-27 12:28:33
// Updated on 2023-05-03 05:31:03
// Updated on 2023-06-25 18:56:21
// Updated on 2023-07-15 08:39:40
// Updated on 2023-09-21 02:37:11
// Updated on 2025-02-11 09:19:27
// Updated on 2025-02-22 11:02:45
// Updated on 2025-03-08 00:38:24
// Updated on 2025-03-12 04:24:54
// Updated on 2025-03-16 12:52:05
// Updated on 2025-03-22 17:05:21
// Updated on 2025-03-23 18:11:52
// Updated on 2025-04-04 02:34:58
// Updated on 2025-04-06 16:37:05
// Updated on 2025-02-12 19:03:15
