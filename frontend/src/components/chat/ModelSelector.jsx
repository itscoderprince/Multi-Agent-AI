import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AGENTS } from "./agents"

export function ModelSelector({ selectedAgent = "auto", onSelectAgent }) {
  // Exclude standalone badge tools (Search and Image)
  const models = AGENTS.filter((a) => a.id !== "search" && a.id !== "image")
  const currentModel = models.find((a) => a.id === selectedAgent) || models[0]
  const CurrentIcon = currentModel.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="h-8 px-3 rounded-full text-xs font-medium bg-[#252528] hover:bg-[#2e2e32] text-neutral-200 border border-neutral-700/60 transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-95 group shadow-xs"
          >
            <CurrentIcon className="size-3.5 text-neutral-300 group-hover:text-white shrink-0" />
            <span className="font-semibold text-neutral-100">{currentModel.name}</span>
            <ChevronDownIcon className="size-3 text-neutral-400 group-hover:text-neutral-200 transition-transform duration-200" />
          </button>
        }
      />
      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-64 p-2 bg-[#1c1c1f] dark:bg-[#1c1c1f] border border-neutral-700/70 rounded-[20px] shadow-2xl text-neutral-200 space-y-0.5 z-50"
      >
        {/* Clean Model List matching Grok reference */}
        {models.map((model) => {
          const Icon = model.icon
          const isSelected = selectedAgent === model.id

          return (
            <DropdownMenuItem
              key={model.id}
              onClick={() => onSelectAgent?.(model.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors outline-none group text-sm font-medium",
                isSelected
                  ? "bg-neutral-800/80 text-white font-semibold"
                  : "hover:bg-neutral-800/50 text-neutral-300 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  isSelected ? "text-white" : "text-neutral-400 group-hover:text-white"
                )}
              />
              <span className="flex-1 text-sm">{model.name}</span>
              {isSelected && (
                <CheckIcon className="size-4 text-neutral-200 shrink-0 ml-auto" />
              )}
            </DropdownMenuItem>
          )
        })}

        {/* Upgrade Card matching Grok bottom card */}
        <div className="mt-1.5 p-3 bg-[#242428] rounded-xl flex items-center justify-between gap-2 border border-white/[0.04]">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white leading-tight">sarthiAi Pro</span>
            <span className="text-[11px] text-neutral-400 leading-tight mt-0.5 truncate">
              Unlock extended capabilities
            </span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors shrink-0 shadow-sm cursor-pointer"
          >
            Upgrade
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ModelSelector
