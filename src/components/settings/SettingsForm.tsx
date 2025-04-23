import React from "react";
import DirectChatToggle from "./DirectChatToggle";
import LanguageSelector from "./LanguageSelector";

type Props = {
  isOpened: boolean;
  onClose: () => void;
};

// Create context for sharing settings across the app
export const SettingsContext = React.createContext<{
  sendChatDirectly: boolean;
  setSendChatDirectly: (value: boolean) => void;
  language: string;
  setLanguage: (value: string) => void;
}>({
  sendChatDirectly: false,
  setSendChatDirectly: () => {},
  language: "en-US",
  setLanguage: () => {},
});

const SettingsForm: React.FC<Props> = ({ isOpened, onClose }) => {
  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpened) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpened, onClose]);

  if (!isOpened) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-opacity-30 backdrop-blur-[3px] z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-[rgb(15,15,15)] rounded-lg p-6 w-96 max-w-[90%] shadow-lg"
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: "zoomIn 0.15s ease-out forwards",
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-xl font-medium">Settings</h2>
            <button
              className="text-gray-400 text-xl cursor-pointer transition-all duration-100 ease-in
              hover:text-white hover:scale-120"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <DirectChatToggle />
            <LanguageSelector />
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsForm;

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize from localStorage if available
  const storedDirectly = localStorage.getItem("sendChatDirectly");
  const initialDirectly = storedDirectly === "true";

  const storedLanguage = localStorage.getItem("recognitionLanguage");
  const initialLanguage = storedLanguage || "en-US";

  const [sendChatDirectly, setSendChatDirectlyState] =
    React.useState(initialDirectly);
  const [language, setLanguageState] = React.useState(initialLanguage);

  // Wrapper to persist the settings
  const setSendChatDirectly = (value: boolean) => {
    setSendChatDirectlyState(value);
    localStorage.setItem("sendChatDirectly", String(value));
  };

  const setLanguage = (value: string) => {
    setLanguageState(value);
    localStorage.setItem("recognitionLanguage", value);
  };

  return (
    <SettingsContext.Provider
      value={{ sendChatDirectly, setSendChatDirectly, language, setLanguage }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
