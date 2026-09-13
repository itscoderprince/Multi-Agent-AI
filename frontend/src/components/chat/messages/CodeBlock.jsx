import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Modern code block component with syntax card, uppercase language label & copy button.
 */
export function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!children) return;
    navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3.5 rounded-xl border border-white/10 bg-[#090b10] overflow-hidden shadow-lg">
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
      <div className="p-3.5 overflow-x-auto text-[13px] font-mono text-slate-200 leading-relaxed scrollbar-thin">
        <pre className="m-0 font-mono">{children}</pre>
      </div>
    </div>
  );
}

export default CodeBlock;
