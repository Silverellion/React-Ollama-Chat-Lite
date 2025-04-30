import React from "react";
import { ChatMessage } from "../server/ChatManager";
import CodeblockConverter from "./utils/CodeblockConverter";
import ImageViewer from "./utils/ImageViewer";

type MessageBubbleProps = {
  message: ChatMessage;
  isLatestAI?: boolean;
};

const ChatBubble: React.FC<MessageBubbleProps> = ({ message }) => {
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
