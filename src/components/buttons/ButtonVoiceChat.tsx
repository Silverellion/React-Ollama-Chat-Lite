import React, { useContext, useState } from "react";
import IconMic from "../../../assets/icons/mic-off.svg";
import IconMicActive from "../../../assets/icons/mic-active.svg";
import { SettingsContext } from "../settings/SettingsForm";

type Props = {
  onSpeechInput: (text: string) => void;
  onDirectSpeechInput?: (text: string) => void;
};

const ButtonVoiceChat: React.FC<Props> = ({
  onSpeechInput,
  onDirectSpeechInput,
}) => {
  const [isListening, setIsListening] = useState(false);
  const { sendChatDirectly, language } = useContext(SettingsContext);

  const toggleListening = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const startListening = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert(
        "Your browser doesn't support speech recognition. Try using Chrome."
      );
      return;
    }

    setIsListening(true);

    // Use browser's speech recognition API with proper type handling
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language; // Use language from settings

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;

      if (sendChatDirectly && onDirectSpeechInput) {
        onDirectSpeechInput(transcript);
      } else {
        onSpeechInput(transcript);
      }

      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <button
      onClick={toggleListening}
      className={`
        rounded-[10px] border border-[rgb(60,60,60)] 
        ${isListening ? "bg-[rgb(240,80,80)]" : "bg-[rgb(200,60,60)]"} 
        shadow-[4px_8px_10px_rgba(0,0,0,0.2)] cursor-pointer 
        p-1 transition duration-300 
        hover:scale-120 hover:border-white hover:bg-[rgb(200,40,40)]
        ${isListening ? "animate-pulse" : ""}
      `}
    >
      <img src={isListening ? IconMicActive : IconMic} alt="Voice Input" />
    </button>
  );
};

export default ButtonVoiceChat;
