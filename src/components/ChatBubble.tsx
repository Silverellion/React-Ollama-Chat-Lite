import React from "react";
import { ChatMessage } from "../server/ChatManager";
import CodeblockConverter from "./utils/CodeblockConverter";
import ImageViewer from "./utils/ImageViewer";

type MessageBubbleProps = {
  message: ChatMessage;
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
// Updated on 2024-03-22 08:49:56
// Updated on 2023-06-23 06:05:17
// Updated on 2023-07-15 14:34:56
// Updated on 2023-09-18 03:02:01
// Updated on 2023-09-22 18:19:39
// Updated on 2023-09-25 21:24:39
// Updated on 2023-11-17 00:20:28
// Updated on 2025-02-09 15:45:50
// Updated on 2025-03-05 16:31:16
// Updated on 2025-03-07 00:29:19
// Updated on 2025-03-12 22:59:10
// Updated on 2025-03-24 07:22:24
// Updated on 2025-02-14 03:11:24
// Updated on 2025-02-14 13:36:51
// Updated on 2025-02-18 15:17:59
// Updated on 2025-02-18 09:35:25
// Updated on 2025-02-18 15:03:42
