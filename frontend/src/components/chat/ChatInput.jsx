import { GlobeIcon, ImageIcon, PaperclipIcon, ArrowUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModelSelector } from "./ModelSelector"

export function ChatInput({
  input,
  setInput,
  onSend,
  selectedAgent = "auto",
  onSelectAgent,
  isSearchActive = true,
  setIsSearchActive,
  isImageActive = false,
  setIsImageActive,
  className,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend?.()
    }
  }

  return (
    <div
      className={cn(
        "rounded-[22px] border border-neutral-800/90 bg-[#1c1c1f] p-4 pb-3 shadow-xl shadow-black/20 focus-within:border-neutral-700/80 transition-all space-y-3",
        className
      )}
    >
      {/* Native textarea with zero nested backgrounds or borders */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message sarthiAi..."
        rows={2}
        className="w-full min-h-[44px] max-h-36 resize-none border-0 outline-none ring-0 focus:ring-0 focus:outline-none bg-transparent p-0 text-sm leading-relaxed text-neutral-100 placeholder:text-neutral-500 shadow-none block"
      />

      {/* Bottom toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
        {/* Left tools: Model Selector + Search Badge + Image Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <ModelSelector
            selectedAgent={selectedAgent}
            onSelectAgent={onSelectAgent}
          />

          {/* Search tool badge */}
          <button
            type="button"
            onClick={() => setIsSearchActive?.((prev) => !prev)}
            className={cn(
              "h-8 px-3 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-95 border",
              isSearchActive
                ? "bg-[#4D6BFE]/15 text-[#6080ff] border-[#4D6BFE]/40 shadow-xs"
                : "bg-[#252528] text-neutral-400 hover:text-neutral-200 hover:bg-[#2e2e32] border-neutral-700/60"
            )}
            title="Toggle Live Web Search"
          >
            <GlobeIcon className="size-3.5" />
            <span>Search</span>
          </button>

          {/* Image tool badge */}
          <button
            type="button"
            onClick={() => setIsImageActive?.((prev) => !prev)}
            className={cn(
              "h-8 px-3 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-95 border",
              isImageActive
                ? "bg-purple-500/15 text-purple-300 border-purple-500/40 shadow-xs"
                : "bg-[#252528] text-neutral-400 hover:text-neutral-200 hover:bg-[#2e2e32] border-neutral-700/60"
            )}
            title="Toggle Image Generation"
          >
            <ImageIcon className="size-3.5" />
            <span>Image</span>
          </button>
        </div>

        {/* Right actions: Attachment & Send */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="size-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-200 hover:bg-[#252528] transition-colors cursor-pointer"
            title="Attach file"
          >
            <PaperclipIcon className="size-4" />
            <span className="sr-only">Attach file</span>
          </button>

          <button
            type="button"
            onClick={onSend}
            disabled={!input?.trim()}
            className={cn(
              "size-8 rounded-full flex items-center justify-center transition-all",
              input?.trim()
                ? "bg-white hover:bg-neutral-200 text-black shadow-sm cursor-pointer active:scale-95"
                : "bg-[#28282b] text-neutral-500 cursor-not-allowed"
            )}
            title="Send message"
          >
            <ArrowUpIcon className="size-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
