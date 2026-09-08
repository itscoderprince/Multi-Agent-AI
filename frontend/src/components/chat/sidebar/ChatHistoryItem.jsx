import { MessageSquare, MoreHorizontal, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function ChatHistoryItem({
  chat,
  isActive,
  onSelect,
  onRename,
  onDelete,
}) {
  return (
    <div
      onClick={() => onSelect?.(chat._id || chat.id)}
      className={cn(
        "group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all border border-transparent",
        isActive
          ? "bg-accent text-accent-foreground border-border/40 shadow-xs"
          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <MessageSquare
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"
          )}
        />
        <span className="truncate text-xs sm:text-sm">{chat.title || "Untitled Chat"}</span>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "shrink-0 transition-opacity",
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-md hover:bg-background/80"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {onRename && (
              <DropdownMenuItem
                onClick={() => onRename(chat)}
                className="gap-2 text-xs cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Rename
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(chat._id || chat.id)}
                className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
