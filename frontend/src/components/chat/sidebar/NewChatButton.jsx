import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus } from "lucide-react";

export default function NewChatButton({ onNewChat, isCollapsed }) {
  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onNewChat}
            variant="outline"
            size="icon"
            className="h-10 w-10 mx-auto rounded-xl border-dashed border-border/80 hover:border-primary/50 hover:bg-accent/60 transition-all shadow-xs shrink-0 flex items-center justify-center"
          >
            <Plus className="h-4 w-4 text-primary" />
            <span className="sr-only">New chat</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          New chat
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button
      onClick={onNewChat}
      variant="outline"
      className="w-full justify-start gap-2.5 h-10 px-3.5 font-medium rounded-xl border-dashed border-border/80 hover:border-primary/50 hover:bg-accent/60 transition-all shadow-xs"
    >
      <div className="flex items-center justify-center h-5 w-5 rounded-md bg-primary/10 text-primary shrink-0">
        <Plus className="h-3.5 w-3.5" />
      </div>
      <span className="text-xs font-medium">New chat</span>
    </Button>
  );
}
