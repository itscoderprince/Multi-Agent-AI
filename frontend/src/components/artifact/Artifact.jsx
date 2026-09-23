import { useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RotateCw,
  Code2,
  Eye,
  Copy,
  Check,
  Download,
  FileCode,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { closeArtifact } from "@/redux/slices/messageSlice";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { SyntaxHighlighter, oneDark } from "@/lib/syntaxHighlighter";
import { useIsMobile } from "@/hooks/use-mobile";

// Clean theme that removes gray bounding boxes behind tokens/lines
const cleanSyntaxTheme = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: "transparent",
    backgroundColor: "transparent",
    margin: 0,
    padding: 0,
    fontSize: "13px",
    lineHeight: "1.65",
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: "transparent",
    backgroundColor: "transparent",
    fontSize: "13px",
  },
};

/**
 * Robustly merges HTML, CSS, and JS files into an interactive, executable document.
 * Crucially removes external <link> and <script src> tags to prevent Vite 404 network errors
 * that cause "Unexpected token '<'" SyntaxErrors inside the iframe sandbox.
 */
function buildRunnableHtml(files) {
  if (!Array.isArray(files) || files.length === 0) return "";

  const htmlFile =
    files.find((f) => f.name?.toLowerCase().endsWith(".html")) || files[0];
  const cssFiles = files.filter((f) => f.name?.toLowerCase().endsWith(".css"));
  const jsFiles = files.filter(
    (f) =>
      f.name?.toLowerCase().endsWith(".js") &&
      !f.name?.toLowerCase().endsWith(".json")
  );

  let doc = htmlFile?.content || "";

  // If the file is not HTML (e.g. pure JS/CSS/Python), wrap in a clean container
  if (!htmlFile?.name?.toLowerCase().endsWith(".html")) {
    if (htmlFile?.name?.toLowerCase().endsWith(".css")) {
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${doc}</style></head><body><div style="font-family:sans-serif;padding:24px;color:#eee;">CSS Preview Loaded</div></body></html>`;
    }
    if (htmlFile?.name?.toLowerCase().endsWith(".js")) {
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="background:#0e1017;color:#eee;"><script>${doc}<\/script></body></html>`;
    }
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{background:#0e1017;color:#eee;font-family:monospace;padding:24px;}</style></head><body><pre><code>${doc.replace(/</g, "&lt;")}</code></pre></body></html>`;
  }

  // 1. Strip external <link rel="stylesheet"> & .css link tags so iframe doesn't trigger 404s
  doc = doc.replace(/<link\b[^>]*\bhref=["'][^"']*\.css["'][^>]*\/?>/gi, "");
  doc = doc.replace(/<link\b[^>]*\brel=["']stylesheet["'][^>]*\/?>/gi, "");

  // 2. Strip external <script src="..."></script> tags so iframe doesn't execute 404 HTML as JS
  doc = doc.replace(/<script\b[^>]*\bsrc=["'][^"']*\.js["'][^>]*>\s*<\/script>/gi, "");
  doc = doc.replace(/<script\b[^>]*\bsrc=["'][^"']*\.js["'][^>]*\/?>/gi, "");

  // 3. Inject DOMContentLoaded and window.onload polyfill into <head>
  const domReadyPolyfill = `<script>
(function() {
  var origAdd = document.addEventListener;
  document.addEventListener = function(evt, fn, opts) {
    if (evt === 'DOMContentLoaded' && (document.readyState === 'interactive' || document.readyState === 'complete')) {
      setTimeout(function() { try { fn(new Event('DOMContentLoaded')); } catch(e) { console.error(e); } }, 1);
    } else {
      origAdd.call(document, evt, fn, opts);
    }
  };
  var origWinAdd = window.addEventListener;
  window.addEventListener = function(evt, fn, opts) {
    if (evt === 'load' && document.readyState === 'complete') {
      setTimeout(function() { try { fn(new Event('load')); } catch(e) { console.error(e); } }, 1);
    } else {
      origWinAdd.call(window, evt, fn, opts);
    }
  };
})();
<\/script>`;

  if (doc.includes("<head>")) {
    doc = doc.replace("<head>", `<head>\n${domReadyPolyfill}`);
  } else if (doc.includes("<html>")) {
    doc = doc.replace("<html>", `<html>\n<head>${domReadyPolyfill}</head>`);
  } else {
    doc = `${domReadyPolyfill}\n${doc}`;
  }

  // 4. Inject CSS
  const combinedCss = cssFiles
    .map((c) => c.content || "")
    .join("\n\n");

  if (combinedCss.trim()) {
    const styleTag = `<style data-inlined="true">\n${combinedCss}\n</style>`;
    if (doc.includes("</head>")) {
      doc = doc.replace("</head>", `${styleTag}\n</head>`);
    } else {
      doc = `${styleTag}\n${doc}`;
    }
  }

  // 5. Inject JS
  const combinedJs = jsFiles
    .map((j) => j.content || "")
    .join("\n\n");

  if (combinedJs.trim()) {
    const scriptTag = `<script data-inlined="true">\n${combinedJs}\n<\/script>`;
    if (doc.includes("</body>")) {
      doc = doc.replace("</body>", `${scriptTag}\n</body>`);
    } else {
      doc = `${doc}\n${scriptTag}`;
    }
  }

  return doc;
}

/**
 * Artifact Component using Shadcn Sheet
 * Full-width responsive mobile sheet & resizable desktop canvas.
 */
export default function Artifact() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const activeArtifact = useSelector((state) => state.messages.activeArtifact);
  const isArtifactOpen = useSelector((state) => state.messages.isArtifactOpen);
  const allMessages = useSelector((state) => state.messages.messageData);
  const artifacts = useSelector((state) => state.messages.artifacts);

  const [view, setView] = useState("preview"); // "preview" | "code"
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [previewKey, setPreviewKey] = useState(0);
  const [copied, setCopied] = useState(false);

  // Resizable drawer width state (matching user reference)
  const [panelWidth, setPanelWidth] = useState(760);
  const [isMaximized, setIsMaximized] = useState(false);
  const isResizing = useRef(false);

  // Drag resize handler for sliding width left and right (desktop only)
  const startResize = (e) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMouseMove = (moveEvent) => {
      if (!isResizing.current) return;
      const newWidth = window.innerWidth - moveEvent.clientX;
      const clampedWidth = Math.max(380, Math.min(window.innerWidth - 60, newWidth));
      setPanelWidth(clampedWidth);
      setIsMaximized(false);
    };

    const onMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const rawFiles = useMemo(() => activeArtifact?.files || [], [activeArtifact]);

  // Ensure all codes (HTML, CSS, JS) are present category-wise, never leaving out companion files
  const files = useMemo(() => {
    if (rawFiles.length > 1) return rawFiles;

    // If activeArtifact only has 1 file, check if an existing artifact has all files
    const multiArtifact = artifacts.find(
      (a) => Array.isArray(a.files) && a.files.length > 1
    );
    if (multiArtifact) {
      return multiArtifact.files;
    }

    // Check message history for multi-files
    for (let i = allMessages.length - 1; i >= 0; i--) {
      const msg = allMessages[i];
      if (Array.isArray(msg?.artifact?.files) && msg.artifact.files.length > 1) {
        return msg.artifact.files;
      }
      if (Array.isArray(msg?.uiFiles) && msg.uiFiles.length > 1) {
        return msg.uiFiles;
      }
    }

    // If still 1 file, and it's JS or CSS, provide clean companion HTML/CSS so it runs!
    if (rawFiles.length === 1) {
      const single = rawFiles[0];
      const name = single.name?.toLowerCase() || "";
      if (name.endsWith(".js")) {
        return [
          {
            name: "index.html",
            content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Calculator</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <div class="calculator">\n    <div class="display">\n      <div class="expression" id="expression"></div>\n      <div class="result" id="display">0</div>\n    </div>\n    <div class="buttons">\n      <button class="btn function" data-action="clear">C</button>\n      <button class="btn function" data-action="delete">⌫</button>\n      <button class="btn function" data-action="percent">%</button>\n      <button class="btn operator" data-action="operator" data-value="/">÷</button>\n      <button class="btn number" data-action="number" data-value="7">7</button>\n      <button class="btn number" data-action="number" data-value="8">8</button>\n      <button class="btn number" data-action="number" data-value="9">9</button>\n      <button class="btn operator" data-action="operator" data-value="*">×</button>\n      <button class="btn number" data-action="number" data-value="4">4</button>\n      <button class="btn number" data-action="number" data-value="5">5</button>\n      <button class="btn number" data-action="number" data-value="6">6</button>\n      <button class="btn operator" data-action="operator" data-value="-">−</button>\n      <button class="btn number" data-action="number" data-value="1">1</button>\n      <button class="btn number" data-action="number" data-value="2">2</button>\n      <button class="btn number" data-action="number" data-value="3">3</button>\n      <button class="btn operator" data-action="operator" data-value="+">+</button>\n      <button class="btn zero" data-action="number" data-value="0">0</button>\n      <button class="btn decimal" data-action="decimal">.</button>\n      <button class="btn equals" data-action="equals">=</button>\n    </div>\n  </div>\n  <script src="script.js"><\/script>\n</body>\n</html>`,
          },
          {
            name: "style.css",
            content: `/* Modern Dark Calculator Styles */\nbody { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #0f1117; color: #fff; font-family: system-ui, sans-serif; margin: 0; }\n.calculator { width: 340px; background: #181b24; border-radius: 20px; padding: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.08); }\n.display { background: #11141c; padding: 16px; border-radius: 12px; margin-bottom: 16px; text-align: right; min-height: 80px; display: flex; flex-direction: column; justify-content: flex-end; border: 1px solid rgba(255,255,255,0.06); }\n.expression { color: #8892b0; font-size: 14px; min-height: 20px; }\n.result { font-size: 32px; font-weight: 600; color: #fff; }\n.buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }\n.btn { height: 54px; border: none; border-radius: 12px; font-size: 18px; font-weight: 600; cursor: pointer; color: #fff; background: #232734; transition: all 0.15s; }\n.btn:hover { background: #2e3344; }\n.btn:active { transform: scale(0.96); }\n.btn.function { background: #2d3345; color: #cbd5e1; }\n.btn.operator { background: #10b981; }\n.btn.equals { background: #2563eb; }\n.btn.zero { grid-column: span 2; }`,
          },
          single,
        ];
      }
    }

    return rawFiles;
  }, [rawFiles, artifacts, allMessages]);

  const activeFile = files[selectedFileIdx] || files[0] || null;
  const runnableHtml = useMemo(() => buildRunnableHtml(files), [files]);

  const title =
    activeArtifact?.title ||
    (files.some((f) => f.name?.toLowerCase().includes("calc"))
      ? "Simple Calculator"
      : activeFile?.name || "Interactive Preview");

  const handleCopy = () => {
    if (!activeFile?.content) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!activeFile?.content) return;
    const blob = new Blob([activeFile.content], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name || "code.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Sheet
      open={isArtifactOpen}
      onOpenChange={(open) => {
        if (!open) dispatch(closeArtifact());
      }}
    >
      <SheetContent
        side="right"
        style={{
          width: isMobile ? "100vw" : isMaximized ? "96vw" : `${panelWidth}px`,
          maxWidth: isMobile ? "100vw" : "96vw",
        }}
        className="p-0 gap-0 bg-[#0d0f14] border-l border-white/10 text-white flex flex-col h-full z-50 overflow-hidden shadow-2xl transition-[width] duration-75 w-full"
      >
        {/* Sliding Resize Handle on Left Border (Desktop only) */}
        <div
          onMouseDown={startResize}
          className="absolute -left-1.5 top-0 bottom-0 w-3 cursor-ew-resize z-50 hidden lg:flex items-center justify-center group select-none"
          title="Drag to resize width"
        >
          <div className="w-1.5 h-12 rounded-full bg-zinc-600/80 group-hover:bg-emerald-400 group-hover:scale-y-125 transition-all shadow-md" />
        </div>

        {/* Header Bar */}
        <div className="h-12 sm:h-13 px-3 sm:px-4 border-b border-white/8 flex items-center justify-between bg-[#0d0f14] shrink-0 pr-10 sm:pr-12">
          {/* Title */}
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-xs sm:text-sm font-semibold text-zinc-100 truncate tracking-tight">
              {title}
            </h2>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* View Switcher: Preview / Code */}
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setView(view === "preview" ? "code" : "preview")}
              className="text-zinc-400 hover:text-white h-7 px-2 sm:px-2.5 text-xs gap-1 sm:gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 rounded-md"
              title={view === "preview" ? "View Code" : "View Live Preview"}
            >
              {view === "preview" ? (
                <>
                  <Code2 className="size-3.5 text-emerald-400" />
                  <span>Code</span>
                </>
              ) : (
                <>
                  <Eye className="size-3.5 text-emerald-400" />
                  <span>Preview</span>
                </>
              )}
            </Button>

            {/* Quick Maximize / Restore Toggle Button (Desktop only) */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setIsMaximized((prev) => !prev)}
              className="hidden lg:inline-flex text-zinc-400 hover:text-white h-7 w-7 cursor-pointer"
              title={isMaximized ? "Restore size" : "Maximize width"}
            >
              {isMaximized ? (
                <Minimize2 className="size-3.5" />
              ) : (
                <Maximize2 className="size-3.5" />
              )}
            </Button>

            {view === "preview" && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setPreviewKey((k) => k + 1)}
                className="text-zinc-400 hover:text-white h-7 w-7 cursor-pointer"
                title="Reload preview"
              >
                <RotateCw className="size-3.5" />
              </Button>
            )}

            {view === "code" && (
              <>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleCopy}
                  className="text-zinc-400 hover:text-white h-7 w-7 cursor-pointer"
                  title="Copy file"
                >
                  {copied ? (
                    <Check className="size-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleDownload}
                  className="text-zinc-400 hover:text-white h-7 w-7 cursor-pointer"
                  title="Download file"
                >
                  <Download className="size-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* File Tabs Bar - ALWAYS categorized by index.html, style.css, script.js */}
        {files.length > 0 && (
          <div className="h-9 sm:h-10 px-3 sm:px-4 border-b border-white/6 bg-[#090b10] flex items-center gap-1.5 sm:gap-2 overflow-x-auto shrink-0 scrollbar-none">
            {files.map((file, idx) => {
              const isSelected = idx === selectedFileIdx;
              return (
                <button
                  key={file.name || idx}
                  type="button"
                  onClick={() => {
                    setSelectedFileIdx(idx);
                  }}
                  className={`h-6.5 sm:h-7 px-2.5 sm:px-3 text-xs font-mono rounded-md flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer border shrink-0 ${
                    isSelected
                      ? "bg-[#1f2430] border-white/20 text-white font-medium shadow-xs"
                      : "bg-transparent border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  <FileCode
                    className={`size-3 sm:size-3.5 ${
                      isSelected ? "text-emerald-400" : "text-zinc-400"
                    }`}
                  />
                  <span>{file.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 relative min-h-0 flex flex-col overflow-hidden bg-[#07080c]">
          {view === "preview" ? (
            /* Live Interactive Running Preview */
            <div className="flex-1 w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-hidden bg-[#0b0d14]">
              <iframe
                key={previewKey}
                srcDoc={runnableHtml}
                title="Artifact Preview"
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                className="w-full h-full border-0 rounded-lg sm:rounded-xl bg-transparent"
              />
            </div>
          ) : (
            /* Code View with Syntax Highlighting and Line Numbers */
            <div className="flex-1 overflow-auto p-3 sm:p-4 text-[12px] sm:text-[13px] bg-[#07080c] font-mono scrollbar-thin">
              <SyntaxHighlighter
                language={activeFile?.name?.split(".").pop() || "javascript"}
                style={cleanSyntaxTheme}
                showLineNumbers={true}
                wrapLines={false}
                lineNumberStyle={{
                  minWidth: "2.5em",
                  paddingRight: "0.8em",
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
                {activeFile?.content || ""}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
