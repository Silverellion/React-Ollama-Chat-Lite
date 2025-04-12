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
// Updated on 2025-02-26 06:56:10
// Updated on 2025-02-28 17:40:54
// Updated on 2025-03-01 22:07:20
// Updated on 2023-03-11 12:28:23
// Updated on 2023-04-20 02:54:41
// Updated on 2023-10-06 18:12:23
// Updated on 2023-10-14 01:44:25
// Updated on 2023-10-17 02:12:28
// Updated on 2023-11-06 01:24:41
// Updated on 2023-12-02 03:03:25
// Updated on 2025-02-15 22:00:27
// Updated on 2025-02-17 07:17:35
// Updated on 2025-02-22 01:09:52
// Updated on 2025-02-23 13:29:05
// Updated on 2025-02-23 11:35:42
// Updated on 2025-03-07 15:23:35
// Updated on 2025-03-12 21:41:20
// Updated on 2025-03-23 23:45:44
// Updated on 2025-03-24 09:28:32
// Updated on 2025-04-02 11:01:33
// Updated on 2025-02-18 07:57:32
// Updated on 2025-02-22 17:31:06
// Updated on 2025-02-28 02:04:42
// Updated on 2025-03-01 12:09:34
// Updated on 2025-03-01 00:58:13
// Updated on 2025-03-08 20:52:10
// Updated on 2025-03-20 13:21:23
// Updated on 2025-03-26 21:52:57
// Updated on 2025-04-13 06:37:23
