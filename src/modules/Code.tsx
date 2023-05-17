import "@/styles/prism.css";
import { highlightAll } from "prismjs";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-typescript";
import React, { useEffect } from "react";

interface CodeProps {
  lang: string;
  code: string;
}

const Code: React.FC<CodeProps> = ({ lang, code }) => {
  useEffect(() => {
    highlightAll();
  }, [lang]);

  return (
    <>
      <p className="text-lg font-semibold">{lang}</p>
      <pre className="max-h-60 overflow-auto">
        <code className={`language-${lang}`}>{code}</code>
      </pre>
    </>
  );
};

export default Code;
