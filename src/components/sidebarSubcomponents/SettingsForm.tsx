import React from "react";

type Props = {
  isOpened: boolean;
  onClose: () => void;
};

// Create context for sharing settings across the app
export const SettingsContext = React.createContext<{
  sendChatDirectly: boolean;
  setSendChatDirectly: (value: boolean) => void;
}>({
  sendChatDirectly: false,
  setSendChatDirectly: () => {},
});

const SettingsForm: React.FC<Props> = ({ isOpened, onClose }) => {
  const [sendChatDirectly, setSendChatDirectly] = React.useState(false);

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
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-xl font-medium">Settings</h2>
            <button
              className="text-gray-400 hover:text-white text-xl cursor-pointer"
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

            <div className="text-gray-400 text-sm">
              When enabled, voice chat will send your speech directly to the AI
              without showing in the text box first.
            </div>

            {/* Add more settings later */}
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
  const [sendChatDirectly, setSendChatDirectly] = React.useState(false);

  return (
    <SettingsContext.Provider value={{ sendChatDirectly, setSendChatDirectly }}>
      {children}
    </SettingsContext.Provider>
  );
};
