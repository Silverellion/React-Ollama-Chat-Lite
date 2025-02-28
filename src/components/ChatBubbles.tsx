import React from "react";
import OllamaResponse from "../server/Ollama/OllamaService";
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

  const deduplicatedMessages = React.useMemo(() => {
    const messagesWithPositions: ChatMessage[] = [];
    const messagePositions = new Map<string, number[]>();

    // First pass: collect position information for each message
    messages.forEach((msg, index) => {
      const msgKey = `${msg.text}-${msg.isUser}-${
        msg.image ? JSON.stringify(msg.image) : ""
      }`;

      // Store the position of this message
      const positions = messagePositions.get(msgKey) || [];
      positions.push(index);
      messagePositions.set(msgKey, positions);
    });

    // Second pass: identify duplicates and preserve intentional repeats
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
      // Check if the model doesn't support images but image data was provided
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
            <ChatBubble key={index} message={message} />
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
// Updated on 2024-01-18 08:37:49
// Updated on 2025-04-04 04:52:46
// Updated on 2025-04-09 13:11:39
// Updated on 2023-04-28 01:34:48
// Updated on 2023-08-16 13:50:00
// Updated on 2023-09-18 07:34:23
// Updated on 2025-02-14 11:01:13
// Updated on 2025-02-17 05:32:09
// Updated on 2025-02-23 17:03:36
// Updated on 2025-02-24 15:55:11
// Updated on 2025-02-26 21:42:42
// Updated on 2025-03-05 09:48:39
// Updated on 2025-03-07 13:31:57
// Updated on 2025-03-10 13:43:52
// Updated on 2025-04-02 10:49:33
// Updated on 2025-02-28 19:21:06
