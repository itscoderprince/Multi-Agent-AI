import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Code2Icon,
  FileCodeIcon,
  ArrowUpRightIcon,
  CopyIcon,
  CheckIcon,
  RotateCcwIcon,
} from "lucide-react"

export function ChatMessageItem({ msg, onOpenArtifact }) {
  const isUser = msg.role === "user"
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    if (msg?.content) {
      navigator.clipboard.writeText(msg.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isUser) {
    return (
      <div className="flex justify-end w-full py-1">
        <div className="max-w-[80%] sm:max-w-lg md:max-w-xl bg-[#2a2a2e] text-neutral-100 rounded-3xl px-4.5 py-2.5 text-[15px] leading-relaxed shadow-xs whitespace-pre-wrap">
          {msg.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full py-2 space-y-2 group text-left">
      {/* Prose / Response Content directly on canvas like ChatGPT / Claude / Gemini */}
      <div className="text-[15px] leading-relaxed text-neutral-200 whitespace-pre-wrap selection:bg-blue-600/30">
        {msg.content}
      </div>

      {/* Embedded Code Snippet / Artifact Card if present */}
      {msg.artifact && (
        <div className="rounded-xl border border-neutral-800 bg-[#161618] p-3.5 space-y-2 mt-2 shadow-xs max-w-2xl">
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <FileCodeIcon className="size-3.5 text-blue-400 shrink-0" />
              <span className="font-mono font-medium truncate text-neutral-200">
                {msg.artifact.title}
              </span>
              <Badge
                variant="outline"
                className="text-[10px] uppercase font-mono px-1 py-0 border-neutral-700 text-neutral-400"
              >
                {msg.artifact.language || "code"}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1 cursor-pointer shrink-0 border-neutral-700 hover:bg-neutral-800 text-neutral-200"
              onClick={() => onOpenArtifact?.(msg.artifact)}
            >
              <Code2Icon className="size-3.5" />
              <span>Preview</span>
              <ArrowUpRightIcon className="size-3" />
            </Button>
          </div>

          <pre className="rounded-lg bg-neutral-950 p-3 text-xs text-neutral-300 overflow-x-auto font-mono max-h-44 leading-tight border border-neutral-800">
            <code>{msg.artifact.code.slice(0, 220)}...</code>
          </pre>
        </div>
      )}

      {/* Modern AI Action Bar: Copy & Regenerate (like ChatGPT / Claude / DeepSeek) */}
      <div className="flex items-center gap-1 pt-1 opacity-70 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={handleCopy}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors cursor-pointer"
          title="Copy response"
        >
          {copied ? (
            <CheckIcon className="size-3.5 text-emerald-400" />
          ) : (
            <CopyIcon className="size-3.5" />
          )}
        </button>
        <button
          type="button"
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors cursor-pointer"
          title="Regenerate"
        >
          <RotateCcwIcon className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

export default ChatMessageItem
