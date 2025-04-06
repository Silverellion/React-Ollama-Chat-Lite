import React from "react";
import SpinningAmogus from "../../assets/images/SpinningAmogus.gif";

const GreetingMessage: React.FC = () => {
  const randomMessages: string[] = [
    "I wanna Special Summon Kitkallos and mill 5.",
    "I wanna unblock the block and commit legocity 🤑",
    "Let's play Among Us in real life!",
    "I've forgotten my last year self already :(",
    "I wish to be innocent again.",
    "I want to regain what I've forgotten.",
    "I can't keep doing this.",
    "I don't want people to look up to me.",
    "Will the lord ever forgive me for what I did?",
    "I am a terrible person.",
    "I don't want to change.",
  ];

  const messageRef = React.useRef<string>("");
  if (messageRef.current === "") {
    messageRef.current =
      randomMessages[Math.floor(Math.random() * randomMessages.length)];
  }
  return (
    <>
      <div className="flex flex-col text-center justify-center">
        <img
          src={SpinningAmogus}
          className="rounded-full shadow-[4px_8px_10px_rgba(0,0,0,0.2)] max-w-30 mx-auto mb-4"
        />
        <div className="text-white text-2xl" style={{ fontFamily: "AmongUs" }}>
          {messageRef.current}
        </div>
      </div>
    </>
  );
};

export default GreetingMessage;
// Updated on 2023-10-14 20:46:56
// Updated on 2023-11-15 16:16:18
// Updated on 2023-12-17 09:11:40
// Updated on 2024-01-02 13:28:38
// Updated on 2024-02-19 01:46:16
// Updated on 2025-02-17 08:44:27
// Updated on 2025-03-11 08:10:27
// Updated on 2025-03-16 09:51:33
// Updated on 2023-04-26 18:26:47
// Updated on 2023-07-31 19:16:44
// Updated on 2023-09-21 04:32:59
// Updated on 2023-12-04 10:39:07
// Updated on 2025-02-11 07:25:22
// Updated on 2025-03-10 07:44:53
// Updated on 2025-03-18 17:41:03
// Updated on 2025-04-03 01:00:20
// Updated on 2025-04-04 20:13:49
// Updated on 2025-04-09 14:34:52
// Updated on 2025-02-06 00:29:19
// Updated on 2025-02-18 23:48:29
// Updated on 2025-02-18 03:36:11
// Updated on 2025-03-01 21:51:45
// Updated on 2025-03-04 05:32:03
// Updated on 2025-03-12 17:28:49
// Updated on 2025-03-20 11:38:26
// Updated on 2025-03-22 09:38:46
// Updated on 2025-03-31 15:07:41
// Updated on 2025-04-03 16:08:51
// Updated on 2025-04-06 19:55:46
