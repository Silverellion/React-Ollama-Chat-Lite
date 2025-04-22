import React from "react";
import IconMic from "../../../assets/icons/mic.svg";

const ButtonAddImage: React.FC = () => {
  return (
    <>
      <input type="file" accept="image/*" className="hidden" multiple />
      <button
        className="
              rounded-[10px] border border-[rgb(60,60,60)] bg-[rgb(200,60,60)] shadow-[4px_8px_10px_rgba(0,0,0,0.2)] cursor-pointer 
              p-1 transition duration-300 
              hover:scale-120 hover:border-white hover:bg-[rgb(200,40,40)]
            "
      >
        <img src={IconMic} />
      </button>
    </>
  );
};

export default ButtonAddImage;
