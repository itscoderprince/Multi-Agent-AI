import { memo } from "react";

/**
 * Minimalist thinking / generating indicator styled after modern AI platforms (DeepSeek, ChatGPT).
 * Memoized to prevent any unnecessary rerenders during streaming cycles.
 */
export function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2.5 py-2 px-1 text-xs text-zinc-400 select-none animate-in fade-in duration-200">
      <span className="size-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-500/50" />
      <span className="font-medium text-slate-300">Thinking</span>
      <div className="flex items-center gap-1">
        <span className="size-1 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="size-1 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="size-1 rounded-full bg-zinc-400 animate-bounce" />
      </div>
    </div>
  );
}

export default memo(ThinkingIndicator);
