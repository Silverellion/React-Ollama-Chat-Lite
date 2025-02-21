import React from "react";

const LoadingAnimation: React.FC = () => {
  const [dots, setDots] = React.useState("");
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) return ".";
        return prevDots + ".";
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);
  return <div>Generating{dots}</div>;
};
export default LoadingAnimation;
// Updated on 2023-09-12 05:18:44
// Updated on 2023-10-30 18:03:05
// Updated on 2024-07-12 07:51:58
// Updated on 2025-03-22 06:44:43
// Updated on 2025-03-24 07:23:40
// Updated on 2023-03-02 14:26:10
// Updated on 2023-06-10 20:30:56
// Updated on 2023-08-02 16:09:33
// Updated on 2023-08-08 09:11:24
// Updated on 2023-09-25 09:04:52
// Updated on 2023-12-14 05:33:45
// Updated on 2025-02-20 00:10:40
// Updated on 2025-02-26 21:21:05
// Updated on 2025-03-04 18:41:59
// Updated on 2025-03-07 07:27:42
// Updated on 2025-03-07 23:18:10
// Updated on 2025-03-14 17:59:03
// Updated on 2025-03-15 12:29:25
// Updated on 2025-03-23 01:55:48
// Updated on 2025-03-24 07:02:43
// Updated on 2025-04-02 19:16:44
// Updated on 2025-04-02 10:37:54
// Updated on 2025-04-03 15:02:26
// Updated on 2025-04-04 21:12:17
// Updated on 2025-04-06 06:15:50
// Updated on 2025-02-12 12:10:54
// Updated on 2025-02-22 01:52:10
