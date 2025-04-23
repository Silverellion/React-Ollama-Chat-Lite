import React, { useContext } from "react";
import { SettingsContext } from "./SettingsForm";

const DirectChatToggle: React.FC = () => {
  const { sendChatDirectly, setSendChatDirectly } = useContext(SettingsContext);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-white">Send chat directly</label>
        <div
          className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${
            sendChatDirectly ? "bg-[rgb(200,60,60)]" : "bg-[rgb(60,60,60)]"
          }`}
          onClick={() => setSendChatDirectly(!sendChatDirectly)}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
              sendChatDirectly ? "transform translate-x-6.5" : "translate-x-0.5"
            }`}
          ></div>
        </div>
      </div>

      <div className="text-gray-400 text-sm">
        When enabled, voice chat will send your speech directly to the AI
        without showing in the text box first.
      </div>
    </div>
  );
};

export default DirectChatToggle;
