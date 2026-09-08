import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function NewChatButton({ onNewChat }) {
  return (
    <Button
      onClick={onNewChat}
      variant="outline"
      className="w-full justify-start gap-2 h-11 px-4 font-medium rounded-xl border-dashed border-border/80 hover:border-primary/50 hover:bg-accent/60 transition-all shadow-xs"
    >
      <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-primary/10 text-primary">
        <Plus className="h-4 w-4" />
      </div>
      <span className="text-sm">New chat</span>
    </Button>
  );
}
