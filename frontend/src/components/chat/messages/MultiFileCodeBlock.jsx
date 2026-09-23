import { useState, memo } from "react";
import { useDispatch } from "react-redux";
import { Check, Copy, Download, Play, FileCode } from "lucide-react";
import { SyntaxHighlighter, oneDark } from "@/lib/syntaxHighlighter";
import { setActiveArtifact } from "@/redux/slices/messageSlice";

// Custom dark syntax theme matching code editor appearance
const syntaxTheme = {
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

const EXT_TO_LANG = {
  html: "html",
  htm: "html",
  css: "css",
  js: "javascript",
  javascript: "javascript",
  jsx: "jsx",
  ts: "typescript",
  typescript: "typescript",
  tsx: "tsx",
  json: "json",
  py: "python",
  python: "python",
};

/**
 * MultiFileCodeBlock
 * Displays tabbed files (e.g. index.html, style.css, script.js) with:
 * - Tab switcher matching user reference image
 * - Line numbers and syntax highlighting
 * - Copy, Download, and [▶ Run] toolbar actions
 * - [▶ Run] packages all files and opens the live interactive Sheet
 * Memoized to prevent heavy Prism re-parsing across render cycles.
 */
export function MultiFileCodeBlock({ files = [], title = "Simple Calculator" }) {
  const dispatch = useDispatch();
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!Array.isArray(files) || files.length === 0) return null;

  const currentFile = files[activeIdx] || files[0];
  const ext = (currentFile.name || "").split(".").pop().toLowerCase();
  const lang = EXT_TO_LANG[ext] || "text";

  const handleCopy = () => {
    if (!currentFile?.content) return;
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!currentFile?.content) return;
    const blob = new Blob([currentFile.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = currentFile.name || "code.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRun = () => {
    dispatch(
      setActiveArtifact({
        id: Date.now(),
        title: title || "Simple Calculator",
        files: files,
      })
    );
  };

  return (
    <div className="relative my-4 rounded-xl border border-white/10 bg-[#0d0f14] overflow-hidden shadow-lg">
      {/* Top Header: File Tabs on Left + Actions on Right */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#090b10] border-b border-white/8 gap-2">
        {/* File Tabs Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {files.map((file, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={file.name || idx}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`h-7 px-2.5 text-xs font-mono rounded-md flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isActive
                    ? "bg-[#1f2430] border-white/20 text-white font-medium shadow-xs"
                    : "bg-transparent border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                <FileCode
                  className={`size-3.5 ${
                    isActive ? "text-emerald-400" : "text-zinc-500"
                  }`}
                />
                <span>{file.name}</span>
              </button>
            );
          })}
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2.5 shrink-0 text-xs font-mono">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Copy current file"
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
            className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Download current file"
          >
            <Download className="size-3.5" />
            <span className="font-sans">Download</span>
          </button>

          <span className="text-zinc-700 select-none">|</span>

          <button
            type="button"
            onClick={handleRun}
            className="flex items-center gap-1.5 text-zinc-200 hover:text-emerald-400 transition-colors cursor-pointer font-medium"
            title="Run all files in Sheet preview"
          >
            <Play className="size-3.5 fill-current text-emerald-400" />
            <span className="font-sans text-emerald-400 font-semibold">Run</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body with Line Numbers */}
      <div className="p-3.5 overflow-x-auto scrollbar-thin text-[13px] bg-[#07080c] font-mono">
        <SyntaxHighlighter
          language={lang}
          style={syntaxTheme}
          showLineNumbers={true}
          wrapLines={false}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            color: "#4b5563",
            textAlign: "right",
            userSelect: "none",
          }}
          customStyle={{
            background: "transparent",
            margin: 0,
            padding: 0,
          }}
          codeTagProps={{
            style: {
              background: "transparent",
            },
          }}
        >
          {currentFile.content || ""}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default memo(MultiFileCodeBlock);
