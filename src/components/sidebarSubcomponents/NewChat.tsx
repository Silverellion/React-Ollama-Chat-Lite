import React from "react";
import IconAdd from "../../../assets/icons/add.svg";

type Props = {
  isSidebarCollapsed: boolean;
  onNewChat: () => void;
};

const NewChat: React.FC<Props> = ({ isSidebarCollapsed, onNewChat }) => {
  const [isTextVisible, setIsTextVisible] = React.useState(false);

  React.useEffect(() => {
    if (!isSidebarCollapsed) {
      const timeout = setTimeout(() => {
        setIsTextVisible(true);
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      setIsTextVisible(false);
    }
  }, [isSidebarCollapsed]);

  return (
    <button
      onClick={onNewChat}
      className={`${
        isSidebarCollapsed
          ? "w-10 h-10 fixed top-3 left-2 rounded-full justify-center"
          : "w-full p-2 mt-1 rounded-[15px]"
      } 
    bg-[rgb(200,60,60)] text-white flex items-center 
    cursor-pointer hover:bg-[rgb(200,40,40)] transition-all duration-300 ease-out hover:scale-110`}
    >
      {isSidebarCollapsed ? (
        <img src={IconAdd} />
      ) : (
        <span
          className={`transform transition-opacity duration-300 ease-out 
        ${isTextVisible ? "opacity-100" : "opacity-0"}`}
        >
          New Chat
        </span>
      )}
    </button>
  );
};

export default NewChat;
