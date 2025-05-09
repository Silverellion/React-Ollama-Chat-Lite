import React from "react";
import IconUp from "../../assets/icons/up.svg";
import ButtonAddImage from "./buttons/ButtonAddImage";
import ButtonChangeModel from "./buttons/ButtonChangeModel";
import ButtonVoiceChat from "./buttons/ButtonVoiceChat";
import ImageViewer from "./utils/ImageViewer";

type Props = {
  setUserInput: (value: string) => void;
  setUserImage: (imageData: string | string[], text: string) => void;
  onModelChange?: (model: string, supportsImages: boolean) => void;
};

const MainTextbox: React.FC<Props> = ({
  setUserInput,
  setUserImage,
  onModelChange,
}) => {
  const [text, setText] = React.useState<string>("");
  const [currentImages, setCurrentImages] = React.useState<string[]>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleUserInput = () => {
    if (text.trim() !== "" || currentImages.length > 0) {
      if (currentImages.length > 0) {
        const imagesToSend =
          currentImages.length === 1 ? currentImages[0] : currentImages;
        setUserImage(imagesToSend, text);
      } else if (text.trim() !== "") {
        setUserInput(text);
      }

      setText("");
      setCurrentImages([]);
    }
  };

  const handleImageSelected = (imageData: string) => {
    setCurrentImages((prev) => [...prev, imageData]);
  };

  const handleSpeechInput = (transcript: string) => {
    setText((prevText) => prevText + transcript);
    // Focus the textarea after receiving speech input
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleDirectSpeechInput = (transcript: string) => {
    // Send directly to chat
    if (transcript.trim() !== "") {
      setUserInput(transcript);
    }
  };

  const removeImage = (index: number) => {
    setCurrentImages((prev) => prev.filter((_, i) => i !== index));
  };

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleUserInput();
      } else if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (textarea) {
          const cursorPosition = textarea.selectionStart;
          const textBefore = text.slice(0, cursorPosition);
          const textAfter = text.slice(cursorPosition);
          setText(`${textBefore}\n${textAfter}`);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd =
              cursorPosition + 1;
          }, 0);
        }
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              e.preventDefault();
              const reader = new FileReader();
              reader.onload = (event) => {
                const imageData = event.target?.result as string;
                setCurrentImages((prev) => [...prev, imageData]);
              };
              reader.readAsDataURL(blob);
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    document.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("paste", handlePaste);
    };
  }, [text]);

  return (
    <div
      className="w-full max-w-3xl mt-auto mb-10 shadow-[4px_8px_10px_rgba(0,0,0,0.2)]"
      ref={containerRef}
    >
      <div className="w-full rounded-[1rem] bg-[rgb(45,45,45)] p-4 flex flex-col">
        {currentImages.length > 0 && (
          <ImageViewer
            images={currentImages}
            thumbnailSize={{ width: "80px", height: "80px" }}
            allowDelete={true}
            onDeleteImage={removeImage}
          />
        )}

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleResize}
          style={{ maxHeight: "120px" }}
          className="
            w-full resize-none overflow-y-auto
            placeholder-[rgb(90,90,90)] text-white
            focus:outline-none bg-transparent
          "
          placeholder="Message"
        ></textarea>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <ButtonAddImage onImageSelected={handleImageSelected} />
            <ButtonChangeModel onModelChange={onModelChange} />
          </div>
          <div className="flex gap-2">
            <ButtonVoiceChat
              onSpeechInput={handleSpeechInput}
              onDirectSpeechInput={handleDirectSpeechInput}
            />
            <button
              className="
              rounded-[10px] border border-[rgb(60,60,60)] bg-[rgb(200,60,60)] shadow-[4px_8px_10px_rgba(0,0,0,0.2)] cursor-pointer 
              p-1 transition duration-300 
              hover:scale-120 hover:border-white hover:bg-[rgb(200,40,40)]
            "
              onClick={handleUserInput}
            >
              <img src={IconUp} alt="Send" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainTextbox;
