import { useState, memo } from "react";
import { Copy, CheckCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * UserMessage component rendering the human prompt.
 * Memoized so past user prompts do not rerender on subsequent messages or keystrokes.
 */
export function UserMessage({ content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-end w-full group/user">
      <div className="flex flex-col items-end max-w-[85%] md:max-w-[75%]">
        {/* User Prompt Bubble */}
        <div className="w-fit rounded-2xl bg-[#18366d] border border-blue-400/20 px-3.5 py-1.5 text-[14px] text-slate-100 whitespace-pre-wrap break-words leading-relaxed shadow-sm selection:bg-blue-400/30">
          {content}
        </div>

        {/* Action row with Copy icon button right below the bubble (shown on hover) */}
        <div
          className={`flex items-center gap-1 mt-0.5 mr-0.5 text-zinc-400 transition-opacity duration-150 ${
            copied ? "opacity-100" : "opacity-0 group-hover/user:opacity-100"
          }`}
        >
          <Tooltip>
            <TooltipTrigger
              onClick={handleCopy}
              className="flex items-center justify-center size-5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors outline-none"
              aria-label={copied ? "Copied" : "Copy prompt"}
            >
              {copied ? (
                <CheckCheck className="size-3 text-emerald-400" />
              ) : (
                <Copy className="size-3" />
              )}
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={4}>
              {copied ? "Copied!" : "Copy message"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default memo(UserMessage);
