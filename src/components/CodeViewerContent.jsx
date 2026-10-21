import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("javascript", javascript);
import oneLight from "react-syntax-highlighter/dist/esm/styles/prism/one-light";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import { useTheme } from "../hooks/useTheme.jsx";
import { highlightedLine } from "../data/educationalCode.js";

function accessibleTheme(base, dark) {
  const palette = dark
    ? {
        text: "#e2e8f0",
        comment: "#cbd5e1",
        keyword: "#fda4af",
        string: "#86efac",
        function: "#93c5fd",
        constant: "#fde68a",
        number: "#d8b4fe",
      }
    : {
        text: "#334155",
        comment: "#475569",
        keyword: "#9f1239",
        string: "#166534",
        function: "#1d4ed8",
        constant: "#854d0e",
        number: "#6b21a8",
      };
  return Object.fromEntries(
    Object.entries(base).map(([name, style]) => {
      const category = /comment|prolog|doctype/.test(name)
        ? "comment"
        : /keyword|boolean/.test(name)
          ? "keyword"
          : /string|char|attr-value|macro/.test(name)
            ? "string"
            : /function/.test(name)
              ? "function"
              : /class-name|constant/.test(name)
                ? "constant"
                : /number/.test(name)
                  ? "number"
                  : "text";
      return [
        name,
        {
          ...style,
          ...(style.color ? { color: palette[category] } : {}),
          ...(name.includes("class*=")
            ? { background: "transparent", color: palette.text }
            : {}),
        },
      ];
    }),
  );
}
const accessibleLight = accessibleTheme(oneLight, false);
const accessibleDark = accessibleTheme(oneDark, true);

export default function CodeViewer({
  code,
  activeLine,
  language = "cpp",
  algorithm,
  step,
  mode,
  clean = false,
}) {
  const { theme } = useTheme();
  const source = algorithm
    ? highlightedLine(algorithm, step ?? {}, mode)
    : null;
  if (source) {
    code = source.code;
    activeLine = source.line;
  }
  if (clean) code = code.replace(/[ \t]*\/\/[ \t]*@\w+[^\n]*/g, "");

  const isJS = language === "javascript" || language === "js";
  const title = isJS ? "JavaScript Source Code" : "C++ Source Code";
  const badge = isJS ? "JavaScript" : "C++";
  const highlightLang = isJS ? "javascript" : "cpp";

  return (
    <section className="neo-panel min-w-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/70 px-5 py-4 dark:border-slate-800">
        <h2 className="text-lg font-black">{title}</h2>
        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white dark:bg-cyan-400 dark:text-slate-950">
          {badge}
        </span>
      </div>
      {source && !clean && (
        <p className="px-5 py-2 text-xs text-slate-600 dark:text-slate-300">
          {activeLine
            ? `Source event: ${source.event} · line ${activeLine}`
            : "Source overview — this presentation step has no executable statement."}
        </p>
      )}
      <div
        className="max-h-[520px] overflow-auto p-2"
        tabIndex="0"
        aria-label="Source code"
      >
        <SyntaxHighlighter
          tabIndex={0}
          aria-label="Highlighted source code"
          language={highlightLang}
          style={theme === "dark" ? accessibleDark : accessibleLight}
          showLineNumbers
          wrapLines
          customStyle={{
            margin: 0,
            borderRadius: 22,
            background: "transparent",
            fontSize: "0.86rem",
          }}
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
