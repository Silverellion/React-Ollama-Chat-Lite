import React from "react";
import SpinningAmogus from "../../assets/images/SpinningAmogus.gif";

const GreetingMessage: React.FC = () => {
  const randomMessages: string[] = [
    "I wanna Special Summon Kitkallos and mill 5.",
    "I wanna unblock the block and commit legocity 🤑",
    "Let's play Among Us in real life!",
    "First we mein, then we kampf, LET'S MEIN KAMPF!",
    "I've forgotten my last year self already :(",
    "I wish to be innocent again.",
    "I want to regain what I've forgotten.",
    "I can't keep doing this.",
    "I don't want people to look up to me.",
    "Will the lord ever forgive me for what I did?",
    "I am a terrible person.",
    "I don't want to change.",
    "I didn't know how good I had it",
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
