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
// Updated on 2023-05-19 03:01:44
// Updated on 2023-06-23 13:09:18
// Updated on 2023-06-25 18:50:44
// Updated on 2023-07-31 16:25:53
// Updated on 2023-09-22 22:03:42
// Updated on 2023-11-13 03:53:04
// Updated on 2025-02-11 01:41:31
// Updated on 2025-02-14 17:40:34
// Updated on 2025-02-17 09:21:49
// Updated on 2025-02-18 20:31:55
// Updated on 2025-03-08 23:54:27
// Updated on 2025-03-16 01:32:11
// Updated on 2025-04-01 23:48:37
// Updated on 2025-04-02 02:23:59
// Updated on 2025-04-05 01:48:06
// Updated on 2025-04-06 22:31:23
// Updated on 2025-02-18 00:27:03
// Updated on 2025-02-18 23:52:55
// Updated on 2025-02-22 17:24:21
// Updated on 2025-02-22 04:42:56
// Updated on 2025-03-01 14:51:02
// Updated on 2025-03-07 00:12:26
// Updated on 2025-03-08 11:47:25
// Updated on 2025-03-08 20:27:41
// Updated on 2025-03-10 03:05:03
// Updated on 2025-03-12 06:52:34
