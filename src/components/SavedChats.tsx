import React from "react";
import IconEdit from "../../assets/icons/edit.svg";
import IconDelete from "../../assets/icons/delete.svg";

type Props = {
  isSidebarCollapsed: boolean;
  chatName: string;
  chatId: string;
  onClick: () => void;
  onDelete: (chatId: string) => void;
  onRename: (chatId: string, newName: string) => void;
};

const SavedChat: React.FC<Props> = ({
  isSidebarCollapsed,
  chatName,
  chatId,
  onClick,
  onDelete,
  onRename,
}) => {
  const [isTextVisible, setIsTextVisible] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedName, setEditedName] = React.useState(chatName);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!isSidebarCollapsed) {
      const timeout = setTimeout(() => {
        setIsTextVisible(true);
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      setIsTextVisible(false);
    }
  }, [isSidebarCollapsed]);

  React.useEffect(() => {
    // Focus input when editing mode is activated
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent button's onClick
    onDelete(chatId);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent button's onClick
    setIsEditing(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (editedName.trim()) {
      onRename(chatId, editedName);
      setIsEditing(false);
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent button's onClick
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditedName(chatName); // Reset to original name
      setIsEditing(false);
    } else if (e.key === "Enter") {
      e.preventDefault(); // Prevent any default form submission
      if (editedName.trim()) {
        onRename(chatId, editedName);
        setIsEditing(false);
      }
    }
  };

  const handleInputBlur = () => {
    if (editedName.trim()) {
      onRename(chatId, editedName);
    } else {
      setEditedName(chatName); // Reset to original name
    }
    setIsEditing(false);
  };

  return (
    <button
      onClick={!isEditing ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full p-2 mt-2 bg-[rgb(45,45,45)] text-white shadow-[4px_8px_10px_rgba(0,0,0,0.2)]
        flex items-center justify-between rounded-[15px] 
        cursor-pointer hover:bg-[rgb(30,30,30)] hover:scale-110 transition-all duration-300 ease-out relative`}
    >
      <div className="flex-1 overflow-hidden">
        {isEditing ? (
          <form onSubmit={handleEditSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onClick={handleInputClick}
              onKeyDown={handleKeyDown}
              onBlur={handleInputBlur}
              className="w-full bg-[rgb(60,60,60)] text-white px-2 py-0 rounded-[15px] outline-none"
            />
          </form>
        ) : (
          <span
            className={`transform transition-opacity duration-300 ease-out text-ellipsis-fade
              ${isTextVisible ? "opacity-100" : "opacity-0"}`}
          >
            {chatName}
          </span>
        )}
      </div>
      {isTextVisible && isHovered && !isEditing && (
        <>
          <span
            onClick={handleEditClick}
            className="cursor-pointer hover:scale-140 transition-all duration-300 ease-out ml-2 flex-shrink-0"
          >
            <img src={IconEdit} />
          </span>
          <span
            onClick={handleDeleteClick}
            className="cursor-pointer hover:scale-140 transition-all duration-300 ease-out ml-2 flex-shrink-0"
          >
            <img src={IconDelete} />
          </span>
        </>
      )}
    </button>
  );
};

export default SavedChat;
// Updated on 2023-09-28 21:24:43
// Updated on 2024-05-25 00:15:38
// Updated on 2025-03-29 18:57:06
// Updated on 2025-04-02 08:51:29
// Updated on 2025-04-11 13:13:06
// Updated on 2023-04-02 03:15:56
// Updated on 2023-05-03 02:54:25
// Updated on 2023-10-01 14:37:14
// Updated on 2025-02-14 16:10:53
// Updated on 2025-03-18 12:16:54
// Updated on 2025-04-02 08:14:43
