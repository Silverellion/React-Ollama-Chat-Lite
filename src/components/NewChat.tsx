import React from "react";
import IconAdd from "../../assets/icons/add.svg";

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
// Updated on 2023-08-11 04:45:57
// Updated on 2023-08-27 12:31:06
// Updated on 2023-08-03 04:31:19
// Updated on 2023-09-18 17:26:35
// Updated on 2023-09-25 11:29:43
// Updated on 2023-10-10 11:14:17
// Updated on 2025-04-03 01:03:37
// Updated on 2025-04-03 09:43:07
// Updated on 2025-04-03 16:58:32
// Updated on 2025-04-09 17:08:05
// Updated on 2025-02-18 13:50:58
// Updated on 2025-02-18 21:23:20
// Updated on 2025-02-18 07:10:34
// Updated on 2025-02-18 02:39:43
// Updated on 2025-02-22 15:37:49
// Updated on 2025-02-22 12:59:28
// Updated on 2025-02-26 10:29:18
// Updated on 2025-02-26 02:09:01
// Updated on 2025-03-01 09:09:07
// Updated on 2025-03-01 10:23:49
// Updated on 2025-03-10 14:56:00
// Updated on 2025-03-10 02:58:34
