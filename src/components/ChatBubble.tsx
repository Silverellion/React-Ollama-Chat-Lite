import React, { useContext, useEffect } from "react";
import { ChatMessage } from "../server/ChatManager";
import CodeblockConverter from "./utils/CodeblockConverter";
import ImageViewer from "./utils/ImageViewer";
import { SettingsContext } from "./settings/SettingsForm";
import { TTSService } from "./tts/TTSService";

type MessageBubbleProps = {
  message: ChatMessage;
  isLatestAI?: boolean;
};

const ChatBubble: React.FC<MessageBubbleProps> = ({ message, isLatestAI }) => {
  const { ttsSpeechEnabled } = useContext(SettingsContext);

  useEffect(() => {
    // Only speak the latest non-user message when TTS is enabled
    if (
      isLatestAI &&
      !message.isUser &&
      ttsSpeechEnabled &&
      message.text?.trim()
    ) {
      const ttsService = TTSService.getInstance();
      ttsService.speak(message.text);
    }

    // When ttsSpeechEnabled changes to false, stop any ongoing speech
    return () => {
      if (!ttsSpeechEnabled) {
        const ttsService = TTSService.getInstance();
        ttsService.stop();
      }
    };
  }, [message, ttsSpeechEnabled, isLatestAI]);

  return (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`${
          message.isUser
            ? "bg-[rgb(45,45,45)] shadow-[4px_8px_10px_rgba(0,0,0,0.2)]"
            : ""
        } 
        mt-4 mb-1 pt-2 pb-1.5 px-3 max-w-full text-white rounded-[1rem] 
        break-words whitespace-pre-wrap overflow-wrap-anywhere`}
      >
        {message.text && message.text.trim() !== "" && (
          <div className="mb-1">
            <CodeblockConverter inputMessage={message.text} />
          </div>
        )}
        {message.image && <ImageViewer images={message.image} />}
      </div>
    </div>
  );
};

export default ChatBubble;
