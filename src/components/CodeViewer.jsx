import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../hooks/useTheme.jsx";

export default function CodeViewer({ code, activeLine, language = "cpp" }) {
  const { theme } = useTheme();

  const isJS = language === "javascript" || language === "js";
  const title = isJS ? "JavaScript Source Code" : "C++ Source Code";
  const badge = isJS ? "JavaScript" : "C++";
  const highlightLang = isJS ? "javascript" : "cpp";

  return (
    <section className="neo-panel min-w-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/70 px-5 py-4 dark:border-slate-800">
        <h2 className="text-lg font-black">{title}</h2>
        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white dark:bg-cyan-400 dark:text-slate-950">{badge}</span>
      </div>
      <div className="max-h-[520px] overflow-auto p-2">
        <SyntaxHighlighter
          language={highlightLang}
          style={theme === "dark" ? oneDark : oneLight}
          showLineNumbers
          wrapLines
          customStyle={{ margin: 0, borderRadius: 22, background: "transparent", fontSize: "0.86rem" }}
          lineProps={(lineNumber) => ({
            className: `syntax-line ${lineNumber === activeLine ? "syntax-line-active" : ""}`,
          })}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </section>
  );
}
