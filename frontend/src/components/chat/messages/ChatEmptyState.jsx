import { memo } from "react";
import { Code2, Compass, Lightbulb } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";

const SUGGESTED_PROMPTS = [
  {
    icon: Code2,
    title: "Build a Web App",
    prompt:
      "Create a modern React component for a collaborative task board with drag-and-drop support.",
  },
  {
    icon: Lightbulb,
    title: "Brainstorm Ideas",
    prompt:
      "Give me 5 innovative SaaS project ideas utilizing autonomous multi-agent AI systems.",
  },
  {
    icon: Compass,
    title: "Explain a Concept",
    prompt:
      "Explain how multi-agent coordination works in distributed AI architectures simply.",
  },
];

/**
 * ChatEmptyState component rendering the initial greeting and suggested prompts.
 * Fully responsive for mobile and desktop screens. Memoized for rendering efficiency.
 */
export function ChatEmptyState({ onSelectPrompt }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 pb-32 sm:pb-36 min-h-0 overflow-y-auto">
      <Empty className="max-w-2xl w-full">
        <EmptyHeader className="mb-3 sm:mb-4 text-center">
          <EmptyMedia className="mx-auto mb-2.5 sm:mb-3">
            <div className="size-12 sm:size-14 rounded-2xl bg-linear-to-tr from-emerald-500/20 via-sky-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center shadow-lg shadow-emerald-500/5">
              <img
                src="/favicon.svg"
                alt="SarthiAi"
                className="size-7 sm:size-8 drop-shadow"
              />
            </div>
          </EmptyMedia>
          <EmptyTitle className="text-lg sm:text-xl font-semibold text-slate-100">
            How can SarthiAi help you today?
          </EmptyTitle>
          <EmptyDescription className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Your autonomous multi-agent AI workspace. Ask questions, explore
            code, or solve complex problems.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent className="max-w-2xl w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 w-full mt-1">
            {SUGGESTED_PROMPTS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => onSelectPrompt?.(item.prompt)}
                  className="flex flex-col items-start text-left p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/6 hover:bg-white/10 hover:border-white/15 transition-all group cursor-pointer"
                >
                  <Icon className="size-4 text-emerald-400 mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-slate-200 mb-0.5 sm:mb-1">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.prompt}
                  </span>
                </button>
              );
            })}
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}

export default memo(ChatEmptyState);
