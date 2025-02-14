import React from "react";
import SavedChat from "./SavedChats";
import NewChat from "./NewChat";

type SidebarProps = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  onNewChat: () => void;
  savedChats: { id: string; name: string }[];
  onLoadChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newName: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  onNewChat,
  savedChats,
  onLoadChat,
  onDeleteChat,
  onRenameChat,
}) => {
  return (
    <>
      {!isCollapsed && (
        <div
          className="md:hidden fixed inset-0 backdrop-blur-[1px] z-10"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed flex flex-col top-0 left-0 h-full ${
          isCollapsed ? "w-[0px]" : "w-[300px]"
        } bg-[rgb(15,15,15)] transition-width duration-300 ease-out z-20`}
      >
        <button
          onClick={toggleSidebar}
          className={`${isCollapsed ? "right-[-25px]" : "right-[-12px]"} 
          absolute top-1/2 transform -translate-y-1/2 
          bg-[rgb(200,60,60)] text-white p-2 rounded cursor-pointer 
          hover:scale-110 hover:bg-[rgb(200,40,40)] transition-transform duration-300`}
        >
          <span
            className={`inline-block text-[25px] 
            transform transition-transform duration-900 
          ${isCollapsed ? "rotate-0" : "rotate-900"}`}
          >
            &#10097;
          </span>
        </button>

        {!isCollapsed && (
          <div className="mt-2 mx0 px-5 flex flex-col items-center overflow-y-auto h-[calc(100vh-100px)]">
            <NewChat isSidebarCollapsed={isCollapsed} onNewChat={onNewChat} />
            {savedChats.map((chat) => (
              <SavedChat
                key={chat.id}
                isSidebarCollapsed={isCollapsed}
                chatName={chat.name}
                chatId={chat.id}
                onClick={() => onLoadChat(chat.id)}
                onDelete={onDeleteChat}
                onRename={onRenameChat}
              />
            ))}
          </div>
        )}
      </div>
      {isCollapsed && (
        <NewChat isSidebarCollapsed={isCollapsed} onNewChat={onNewChat} />
      )}
    </>
  );
};

export default Sidebar;
// Updated on 2024-06-26 23:43:25
// Updated on 2025-03-20 04:59:01
// Updated on 2023-06-19 16:36:08
// Updated on 2023-09-18 05:20:38
// Updated on 2023-09-21 06:07:41
// Updated on 2023-11-28 22:53:51
// Updated on 2023-12-04 08:54:25
// Updated on 2025-02-24 11:31:38
// Updated on 2025-03-07 20:21:25
// Updated on 2025-03-08 16:50:22
// Updated on 2025-03-10 14:52:43
// Updated on 2025-03-10 10:26:31
// Updated on 2025-03-23 11:08:02
// Updated on 2025-03-30 02:45:41
// Updated on 2025-04-02 00:10:38
// Updated on 2025-04-03 13:28:11
// Updated on 2025-04-04 01:21:11
// Updated on 2025-02-14 15:48:35
