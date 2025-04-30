import React from "react";
import OllamaResponse from "../server/ollama/OllamaService";
import CodeblockConverter from "./utils/CodeblockConverter";
import { ChatMessage } from "../server/ChatManager";
import LoadingAnimation from "./utils/LoadingAnimation";
import ChatBubble from "./ChatBubble";

type Props = {
  userInput: { dateSent: Date; text: string; image?: string | string[] } | null;
  messages: ChatMessage[];
  model: string;
  supportsImages: boolean;
  onAIResponse: (response: string | null) => void;
};

const ChatBubbles: React.FC<Props> = ({
  userInput,
  messages,
  model,
  supportsImages,
  onAIResponse,
}) => {
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [streamingResponse, setStreamingResponse] = React.useState<string>("");
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const prevUserInputRef = React.useRef<{
    id?: string;
    timestamp?: number;
  } | null>(null);
  const processedMessagesRef = React.useRef<Set<string>>(new Set());

  // Deduplicate messages, preserving intentional repeats
  const deduplicatedMessages = React.useMemo(() => {
    const messagesWithPositions: ChatMessage[] = [];
    const messagePositions = new Map<string, number[]>();

    messages.forEach((msg, index) => {
      const msgKey = `${msg.text}-${msg.isUser}-${
        msg.image ? JSON.stringify(msg.image) : ""
      }`;
      const positions = messagePositions.get(msgKey) || [];
      positions.push(index);
      messagePositions.set(msgKey, positions);
    });

    messages.forEach((msg, index) => {
      const msgKey = `${msg.text}-${msg.isUser}-${
        msg.image ? JSON.stringify(msg.image) : ""
      }`;
      const positions = messagePositions.get(msgKey) || [];
      if (
        positions[0] === index ||
        (index > 0 &&
          (messages[index - 1].text !== msg.text ||
            messages[index - 1].isUser !== msg.isUser ||
            JSON.stringify(messages[index - 1].image) !==
              JSON.stringify(msg.image)))
      ) {
        messagesWithPositions.push(msg);
      }
    });

    return messagesWithPositions;
  }, [messages]);

  const getOllamaResponse = async (
    input: string,
    imageData?: string | string[]
  ) => {
    setIsGenerating(true);
    setStreamingResponse("");

    try {
      if (imageData && !supportsImages) {
        setTimeout(() => {
          onAIResponse("This model doesn't support image input.");
          setIsGenerating(false);
        }, 500);
        return;
      }

      const finalPrompt = input || (imageData ? "What's in this image?" : "");
      const finalResponse = await OllamaResponse(
        finalPrompt,
        (text) => setStreamingResponse(text),
        model,
        imageData
      );
      if (onAIResponse) onAIResponse(finalResponse);
    } catch (error) {
      console.log("Error getting Ollama response:", error);
    } finally {
      setIsGenerating(false);
      setStreamingResponse("");
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  React.useEffect(() => {
    if (userInput && (userInput.text || userInput.image)) {
      const inputId = `${userInput.text}-${userInput.dateSent.getTime()}`;
      if (!processedMessagesRef.current.has(inputId)) {
        processedMessagesRef.current.add(inputId);
        prevUserInputRef.current = {
          id: inputId,
          timestamp: userInput.dateSent.getTime(),
        };

        getOllamaResponse(userInput.text, userInput.image);
      }
    }
    scrollToBottom();
  }, [userInput]);

  return (
    <>
      <div className="w-full overflow-y-auto flex mb-5" ref={chatContainerRef}>
        <div className="relative w-full max-w-3xl mx-auto">
          {deduplicatedMessages.map((message, index) => (
            <ChatBubble
              key={index}
              message={message}
              isLatestAI={
                !message.isUser &&
                index === deduplicatedMessages.length - 1 &&
                !deduplicatedMessages[deduplicatedMessages.length - 1].isUser
              }
            />
          ))}

          {isGenerating && !streamingResponse && (
            <div className="flex justify-start">
              <div className="text-[rgb(90,90,90)] rounded-[1rem] mt-5 p-3 max-w-full break-words whitespace-pre-wrap overflow-wrap-anywhere">
                <LoadingAnimation />
              </div>
            </div>
          )}

          {isGenerating && streamingResponse && (
            <div className="flex justify-start">
              <div className="text-white rounded-[1rem] mt-5 p-3 max-w-full break-words whitespace-pre-wrap overflow-wrap-anywhere">
                <CodeblockConverter inputMessage={streamingResponse} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatBubbles;
