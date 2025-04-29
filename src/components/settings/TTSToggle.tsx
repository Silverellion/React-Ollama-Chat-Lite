import React, { useContext, useEffect } from "react";
import { SettingsContext } from "./SettingsForm";
import { TTSService } from "../tts/TTSService";

const TTSToggle: React.FC = () => {
  const { ttsSpeechEnabled, setTTSSpeechEnabled } = useContext(SettingsContext);
  const ttsService = TTSService.getInstance();

  // When the toggle is turned off, stop any ongoing TTS
  useEffect(() => {
    if (!ttsSpeechEnabled) {
      ttsService.stop();
    }
  }, [ttsSpeechEnabled]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-white">AI Voice Responses</label>
        <div
          className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${
            ttsSpeechEnabled ? "bg-[rgb(200,60,60)]" : "bg-[rgb(60,60,60)]"
          }`}
          onClick={() => setTTSSpeechEnabled(!ttsSpeechEnabled)}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
              ttsSpeechEnabled ? "transform translate-x-6.5" : "translate-x-0.5"
            }`}
          ></div>
        </div>
      </div>

      <div className="text-gray-400 text-sm">
        When enabled, AI responses will be read aloud using natural-sounding
        voice synthesis.
      </div>
    </div>
  );
};

export default TTSToggle;
