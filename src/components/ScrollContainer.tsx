import React from "react";

type ScrollContainerProps = {
  children: React.ReactNode;
  className?: string;
  shouldScroll: boolean;
  maxHeight?: string;
};

const ScrollContainer: React.FC<ScrollContainerProps> = ({
  children,
  className = "",
  shouldScroll = false,
  maxHeight = "calc(100vh-200px)",
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Only scroll when explicitly told to by parent
  React.useEffect(() => {
    if (shouldScroll && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [shouldScroll]);

  return (
    <div
      className={`overflow-y-auto ${className}`}
      style={{ maxHeight }}
      ref={containerRef}
    >
      {children}
    </div>
  );
};

export default ScrollContainer;
