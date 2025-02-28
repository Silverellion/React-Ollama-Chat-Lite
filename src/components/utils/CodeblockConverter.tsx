import React, { useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/felipec.css";
import ReactMarkdown from "react-markdown";
import IconCopy from "../../../assets/icons/copy.svg";
import IconChecked from "../../../assets/icons/checked.svg";

type Props = {
  inputMessage: string;
};

const CodeblockConverter: React.FC<Props> = ({ inputMessage }) => {
  const Codeblock = ({
    code,
    language,
  }: {
    code: string;
    language: string;
  }) => {
    const [copyText, setCopyText] = useState<string>("Copy");
    const [copyIcon, setCopyIcon] = useState<string>(IconCopy);

    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopyText("Copied");
      setCopyIcon(IconChecked);
      setTimeout(() => {
        setCopyText("Copy");
        setCopyIcon(IconCopy);
      }, 5000);
    };

    const highlightedCode = hljs.highlight(code, { language }).value;

    return (
      <div className="relative">
        <button
          onClick={handleCopy}
          className="
            absolute top-2 right-2 z-10 px-2 py-1 cursor-pointer
            bg-[rgb(200,60,60)] text-white rounded shadow-[4px_8px_10px_rgba(0,0,0,0.5)] 
            transition duration-300 flex items-center gap-2
            hover:scale-120 hover:bg-[rgb(200,40,40)]
          "
        >
          <img src={copyIcon} alt="" className="w-4 h-4" />
          {copyText}
        </button>
        <pre>
          <code
            className={`hljs ${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    );
  };

  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match && match[1] ? match[1] : "";

      if (!inline && language) {
        const code = String(children).replace(/\n$/, "");
        return <Codeblock code={code} language={language} />;
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return <ReactMarkdown components={components}>{inputMessage}</ReactMarkdown>;
};

export default CodeblockConverter;
// Updated on 2024-04-23 19:57:18
// Updated on 2025-02-13 03:19:02
// Updated on 2025-02-18 14:05:17
// Updated on 2025-03-31 01:40:16
// Updated on 2025-04-13 04:12:23
// Updated on 2023-05-03 00:27:17
// Updated on 2023-07-18 13:38:40
// Updated on 2023-08-22 01:26:50
// Updated on 2023-12-02 22:51:03
// Updated on 2025-03-17 06:22:48
// Updated on 2025-02-22 00:45:45
// Updated on 2025-02-26 21:02:10
// Updated on 2025-02-26 21:28:57
// Updated on 2025-02-28 11:43:56
