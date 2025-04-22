import React from "react";
import IconSettings from "../../../assets/icons/settings.svg";
import SettingsForm from "./SettingsForm";

type Props = {
  isSidebarCollapsed: boolean;
};

const SettingsButton: React.FC<Props> = ({ isSidebarCollapsed }) => {
  const [isTextVisible, setIsTextVisible] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

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

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpenSettings}
        className={`${isTextVisible ? "opacity-100" : "opacity-0"} 
          w-full p-2 mt-auto mb-4 bg-[rgb(45,45,45)] text-white shadow-[4px_8px_10px_rgba(0,0,0,0.2)]
          flex items-center rounded-[15px] gap-2 
          cursor-pointer hover:bg-[rgb(30,30,30)] hover:scale-110 transition-all duration-300 ease-out relative`}
      >
        <img src={IconSettings} />
        Settings
      </button>
      <SettingsForm isOpened={isSettingsOpen} onClose={handleCloseSettings} />
    </>
  );
};

export default SettingsButton;
