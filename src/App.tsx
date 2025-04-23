import { useState, useEffect } from "react";
import { ChatManager, ChatMessage, SavedChat } from "./server/ChatManager";
import "../global.css";
import Sidebar from "./components/Sidebar";
import ChatBubbles from "./components/ChatBubbles";
import GreetingMessage from "./components/GreetingMessage";
import MainTextbox from "./components/MainTextbox";
import { SettingsProvider } from "./components/settings/SettingsForm";

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
    <SettingsProvider>
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
            isSidebarCollapsed
              ? "ml-[20px] mr-[20px]"
              : "md:ml-[300px] ml-[0px]"
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
    </SettingsProvider>
  );
}

export default App;
