import { useState } from "react";
import { CheckCheck, Copy } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { markdownComponents } from "./markdownComponents";

/**
 * AssistantMessage component rendering the AI response.
 * Styled after leading AI apps (ChatGPT / Claude / DeepSeek):
 * - Clean transparent background (no card / box borders)
 * - Directly renders formatted markdown text
 * - Minimal copy button icon below the response
 */
export function AssistantMessage({ content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full group/msg animate-in fade-in duration-200">
      <div className="w-full text-slate-200">
        {/* Markdown Response Content */}
        <div className="text-[15px] leading-relaxed text-slate-200 selection:bg-emerald-500/20">
          <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content}
          </Markdown>
        </div>

        {/* Action Row with Copy button (shown on hover) */}
        <div
          className={`flex items-center gap-1 mt-2 text-zinc-400 transition-opacity duration-150 ${
            copied ? "opacity-100" : "opacity-0 group-hover/msg:opacity-100"
          }`}
        >
          <Tooltip>
            <TooltipTrigger
              onClick={handleCopy}
              className="flex items-center justify-center size-6.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors outline-none"
              aria-label={copied ? "Copied" : "Copy response"}
            >
              {copied ? (
                <CheckCheck className="size-3.5 text-emerald-400" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={4}>
              {copied ? "Copied!" : "Copy"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default AssistantMessage;
