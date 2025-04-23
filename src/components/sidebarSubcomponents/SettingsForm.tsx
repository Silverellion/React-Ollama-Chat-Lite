import React from "react";

type Props = {
  isOpened: boolean;
  onClose: () => void;
};

type Language = {
  code: string;
  name: string;
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
  // Use the actual context to read and update values
  const { sendChatDirectly, setSendChatDirectly, language, setLanguage } =
    React.useContext(SettingsContext);

  // Available languages
  const languages: Language[] = [
    { code: "en-US", name: "English" },
    { code: "ja-JP", name: "Japanese" },
    { code: "de-DE", name: "German" },
    { code: "fr-FR", name: "French" },
  ];

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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-white">Send chat directly</label>
              <div
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${
                  sendChatDirectly
                    ? "bg-[rgb(200,60,60)]"
                    : "bg-[rgb(60,60,60)]"
                }`}
                onClick={() => setSendChatDirectly(!sendChatDirectly)}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
                    sendChatDirectly
                      ? "transform translate-x-6.5"
                      : "translate-x-0.5"
                  }`}
                ></div>
              </div>
            </div>

            <div className="text-gray-400 text-sm mb-4">
              When enabled, voice chat will send your speech directly to the AI
              without showing in the text box first.
            </div>

            {/* Language selection dropdown */}
            <div className="flex flex-col space-y-2">
              <label className="text-white">Speech recognition language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-[rgb(30,30,30)] text-white p-2 rounded-md border border-[rgb(60,60,60)] focus:outline-none focus:border-[rgb(200,60,60)]"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <div className="text-gray-400 text-sm">
                Choose the language for voice recognition.
              </div>
            </div>
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
