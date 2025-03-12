import React, { useState } from "react";
import "./ImageViewer.css";

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
          className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
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
// Updated on 2024-02-03 13:48:41
// Updated on 2025-03-09 18:14:14
// Updated on 2025-03-12 18:40:41
// Updated on 2025-03-25 18:09:31
// Updated on 2025-03-27 09:48:27
// Updated on 2025-04-16 00:42:41
// Updated on 2023-03-14 14:08:17
// Updated on 2023-04-16 02:23:33
// Updated on 2023-05-03 10:27:29
// Updated on 2023-05-11 02:59:57
// Updated on 2023-06-19 22:25:06
// Updated on 2023-07-18 15:39:38
// Updated on 2023-08-02 10:21:39
// Updated on 2023-09-21 12:33:48
// Updated on 2023-11-13 04:22:24
// Updated on 2023-11-17 18:39:37
// Updated on 2023-12-02 00:43:32
// Updated on 2025-02-14 21:27:00
// Updated on 2025-02-15 21:33:17
// Updated on 2025-02-22 16:37:33
// Updated on 2025-03-24 06:05:11
// Updated on 2025-04-01 15:39:14
// Updated on 2025-02-06 23:27:55
// Updated on 2025-03-01 06:27:19
// Updated on 2025-03-08 01:28:36
// Updated on 2025-03-10 20:59:27
// Updated on 2025-03-12 12:25:24
