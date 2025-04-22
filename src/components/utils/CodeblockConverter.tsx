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
