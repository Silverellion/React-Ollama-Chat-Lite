import React from "react";
import IconChange from "../../../assets/icons/change.svg";
import IconChecked from "../../../assets/icons/checked.svg";

interface ButtonChangeModelProps {
  onModelChange?: (model: string, supportsImages: boolean) => void;
}

const ButtonChangeModel: React.FC<ButtonChangeModelProps> = ({
  onModelChange,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [selectedModel, setSelectedModel] = React.useState("gemma3"); // Default to a vision model

  const models = [
    { name: "llama3.2-vision", supportsImages: true },
    { name: "gemma3", supportsImages: true },
    { name: "qwen2.5-coder", supportsImages: false },
  ];

  const handleModelSelect = (model: string, supportsImages: boolean) => {
    setSelectedModel(model);
    if (onModelChange) {
      onModelChange(model, supportsImages);
    }
    setShowMenu(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      <div
        className={`absolute bottom-full p-0 mb-0 w-50 
        bg-[rgb(45,45,45)] shadow-[4px_8px_10px_rgba(0,0,0,0.2)] z-10 rounded-[10px]
        transition duration-300
        ${
          showMenu
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="p-2 space-y-1">
          {models.map((model) => (
            <li
              key={model.name}
              className="py-1 px-2 m-0
              text-white cursor-pointer rounded-[10px] flex items-center justify-between
                  transition duration-300 hover:bg-[rgb(30,30,30)]"
              onClick={() =>
                handleModelSelect(model.name, model.supportsImages)
              }
            >
              <div className="flex items-center">
                <span>{model.name}</span>
              </div>
              {selectedModel === model.name && (
                <img src={IconChecked} className="w-4 h-4" />
              )}
            </li>
          ))}
        </ul>
      </div>
      <button
        className="
          p-1 rounded-[10px] border border-[rgb(90,90,90)] shadow-[4px_8px_10px_rgba(0,0,0,0.2)] cursor-pointer
          transition duration-300 hover:scale-120 hover:border-white
        "
      >
        <img src={IconChange} />
      </button>
    </div>
  );
};

export default ButtonChangeModel;
// Updated on 2024-04-07 23:47:51
// Updated on 2023-03-02 21:04:53
// Updated on 2023-06-10 18:08:37
// Updated on 2023-08-16 12:20:50
// Updated on 2023-10-06 23:59:10
// Updated on 2023-10-06 08:58:20
// Updated on 2023-11-19 17:29:04
// Updated on 2025-03-07 21:06:45
// Updated on 2025-04-01 09:49:47
// Updated on 2025-04-05 05:37:43
// Updated on 2025-04-06 07:38:20
// Updated on 2025-02-12 21:25:10
// Updated on 2025-02-22 06:51:33
// Updated on 2025-02-26 19:26:14
// Updated on 2025-03-07 10:03:28
// Updated on 2025-03-07 16:19:23
// Updated on 2025-03-10 14:58:28
// Updated on 2025-03-12 00:40:12
