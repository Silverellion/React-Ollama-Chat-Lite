import React from "react";
import IconSettings from "../../../assets/icons/settings.svg";

type Props = {
  isSidebarCollapsed: boolean;
};

const Settings: React.FC<Props> = ({ isSidebarCollapsed }) => {
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
      className={`${isTextVisible ? "opacity-100" : "opacity-0"} 
        w-full p-2 mt-auto mb-4 bg-[rgb(45,45,45)] text-white shadow-[4px_8px_10px_rgba(0,0,0,0.2)]
        flex items-center rounded-[15px] gap-2 
        cursor-pointer hover:bg-[rgb(30,30,30)] hover:scale-110 transition-all duration-300 ease-out relative`}
    >
      <img src={IconSettings} />
      Settings
    </button>
  );
};

export default Settings;
