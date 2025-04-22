import React from "react";
import IconAdd from "../../../assets/icons/add.svg";

interface ButtonAddImageProps {
  onImageSelected: (imageData: string) => void;
}

const ButtonAddImage: React.FC<ButtonAddImageProps> = ({ onImageSelected }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Process each selected file
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          onImageSelected(imageData);
        };
        reader.readAsDataURL(file);
      });

      // Reset the input to allow selecting the same files again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        multiple
      />
      <button
        onClick={handleClick}
        className="
          p-1 rounded-[10px] border border-[rgb(90,90,90)] shadow-[4px_8px_10px_rgba(0,0,0,0.2)] cursor-pointer
          transition duration-300 hover:scale-120 hover:border-white
        "
      >
        <img src={IconAdd} />
      </button>
    </>
  );
};

export default ButtonAddImage;
