import { useState } from "react";
import { useDispatch } from "react-redux";
import { Check, Copy, Download, Play } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { setActiveArtifact } from "@/redux/slices/messageSlice";

// Custom dark syntax theme
const theme = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: "transparent",
    margin: 0,
    padding: 0,
    fontSize: "13px",
    lineHeight: "1.65",
    fontFamily: "'Geist Mono', 'Fira Code', 'Cascadia Code', monospace",
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: "transparent",
    fontSize: "13px",
    fontFamily: "'Geist Mono', 'Fira Code', 'Cascadia Code', monospace",
  },
};

const RUNNABLE_LANGUAGES = new Set([
  "html",
  "htm",
  "css",
  "js",
  "javascript",
  "jsx",
  "ts",
  "typescript",
  "tsx",
  "svg",
  "xml",
]);

const EXT_MAP = {
  html: "html",
  htm: "html",
  css: "css",
  javascript: "js",
  js: "js",
  jsx: "jsx",
  typescript: "ts",
  ts: "ts",
  tsx: "tsx",
  python: "py",
  py: "py",
  json: "json",
  markdown: "md",
  md: "md",
};

/**
 * CodeBlock with Copy, Download, and Run actions matching ChatGPT / DeepSeek.
 */
export function CodeBlock({ language = "text", children }) {
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);

  const code = String(children || "").replace(/\n$/, "");
  const lang = (language || "text").toLowerCase();
  const isRunnable = RUNNABLE_LANGUAGES.has(lang);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = EXT_MAP[lang] || "txt";
    const filename = lang === "html" ? "index.html" : `code.${ext}`;
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRun = () => {
    const ext = EXT_MAP[lang] || "html";
    const filename = lang === "html" ? "index.html" : `script.${ext}`;
    dispatch(
      setActiveArtifact({
        id: Date.now(),
        title: lang === "html" ? "Simple Calculator" : `${lang.toUpperCase()} Preview`,
        files: [{ name: filename, content: code }],
      })
    );
  };

  return (
    <div className="relative my-3 rounded-xl border border-white/10 bg-[#0d0f14] overflow-hidden shadow-md">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-white/[0.03] border-b border-white/6 text-xs font-mono text-zinc-400">
        <span className="font-medium text-zinc-400 lowercase">{lang}</span>

        {/* Actions: Copy | Download | Run */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer text-xs"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-sans">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span className="font-sans">Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer text-xs"
            title="Download file"
          >
            <Download className="size-3.5" />
            <span className="font-sans">Download</span>
          </button>

          {isRunnable && (
            <>
              <span className="text-zinc-700 select-none">|</span>
              <button
                type="button"
                onClick={handleRun}
                className="flex items-center gap-1.5 text-zinc-200 hover:text-emerald-400 transition-colors cursor-pointer font-medium text-xs"
                title="Run and preview code"
              >
                <Play className="size-3.5 fill-current" />
                <span className="font-sans">Run</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Code body */}
      <div className="p-3.5 overflow-x-auto scrollbar-thin text-[13px]">
        <SyntaxHighlighter
          language={lang}
          style={theme}
          PreTag="div"
          CodeTag="code"
          wrapLongLines={false}
          codeTagProps={{
            style: {
              background: "transparent",
            },
          }}
          customStyle={{
            background: "transparent",
            margin: 0,
            padding: 0,
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default CodeBlock;
