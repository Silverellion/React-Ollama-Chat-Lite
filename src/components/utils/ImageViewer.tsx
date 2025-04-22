import React, { useState } from "react";

type Props = {
  images: string | string[];
  thumbnailSize?: { width: string; height: string };
  allowDelete?: boolean;
  onDeleteImage?: (index: number) => void;
};

const ImageViewer: React.FC<Props> = ({
  images,
  thumbnailSize = { width: "80px", height: "80px" },
  allowDelete = false,
  onDeleteImage,
}) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const imageArray = Array.isArray(images) ? images : [images];

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-2">
        {imageArray.map((image, index) => (
          <div
            key={index}
            className={`relative ${allowDelete ? "group" : ""}`}
            style={{ width: thumbnailSize.width, height: thumbnailSize.height }}
          >
            <div
              className="w-full h-full rounded-md overflow-hidden cursor-pointer transition-all duration-300"
              onClick={() => setZoomedImage(image)}
            >
              <img
                src={image}
                className="w-full h-full object-cover transition-all duration-300 hover:brightness-80 hover:scale-120"
              />
            </div>

            {allowDelete && onDeleteImage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteImage(index);
                }}
                className="absolute top-1 right-1 bg-[rgb(200,60,60)] text-white rounded-full
                 w-5 h-5 flex items-center justify-center opacity-0 cursor-pointer
                 group-hover:opacity-100 transition-all duration-300 hover:bg-[rgb(200,40,40)]"
                style={{
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.2)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(3px)",
          }}
          onClick={() => setZoomedImage(null)}
        >
          <img
            src={zoomedImage}
            className="max-w-[90%] max-h-[90vh] object-contain"
            style={{
              animation: "zoomIn 0.15s ease-out forwards",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ImageViewer;
