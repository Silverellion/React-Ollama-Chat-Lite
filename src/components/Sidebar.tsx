import React from "react";
import SavedChat from "./sidebarSubcomponents/SavedChats";
import NewChat from "./sidebarSubcomponents/NewChat";
import Settings from "./sidebarSubcomponents/Settings";

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
        {!isCollapsed && (
          <div className="mt-2 mx0 px-5 flex flex-col items-center overflow-y-auto h-[calc(20vh)]">
            <Settings isSidebarCollapsed={isCollapsed} />
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
