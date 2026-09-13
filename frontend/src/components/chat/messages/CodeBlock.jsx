import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Override oneDark background to match our UI's #090b10
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

/**
 * Modern code block with react-syntax-highlighter (Prism / oneDark theme).
 * Shows language label + copy button in the header bar.
 */
export function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3.5 rounded-xl border border-white/10 bg-[#090b10] overflow-hidden shadow-lg">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-white/[0.04] border-b border-white/8 text-[11px] font-mono text-zinc-400">
        <span className="uppercase tracking-wider font-semibold text-emerald-400/90">
          {language || "code"}
        </span>
        <Button
          variant="ghost"
          size="xs"
          onClick={handleCopy}
          className="h-6 px-2 text-zinc-400 hover:text-white hover:bg-white/10 text-[11px] gap-1.5 cursor-pointer rounded-md transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="size-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>

      {/* Syntax-highlighted body */}
      <div className="p-3.5 overflow-x-auto scrollbar-thin">
        <SyntaxHighlighter
          language={language || "text"}
          style={theme}
          PreTag="div"
          CodeTag="code"
          wrapLongLines={false}
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
