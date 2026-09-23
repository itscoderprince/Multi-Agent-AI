import { useState, memo } from "react";
import { useDispatch } from "react-redux";
import { MoreHorizontal, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import deleteChat from "@/features/deleteChat";
import { deleteChatData } from "@/redux/slices/chatSlice";
import { clearMessageData } from "@/redux/slices/messageSlice";
import { cn } from "cn";

/**
 * Renders an individual chat item in the sidebar with a dropdown actions menu.
 * Memoized to prevent rerenders when other list items or global states change.
 */
const ChatItem = ({ chat, isSelected, onSelect }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const success = await deleteChat(chat._id);
      if (success) {
        dispatch(deleteChatData(chat._id));
        if (isSelected) {
          dispatch(clearMessageData());
        }
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelect = () => {
    onSelect?.(chat);
  };

  return (
    <div
      className={cn(
        "group relative flex items-center justify-between w-full rounded-lg transition-colors cursor-pointer",
        isSelected
          ? "bg-white/10 text-white font-medium"
          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200",
      )}
    >
      {/* Clickable chat title */}
      <button
        type="button"
        onClick={handleSelect}
        title={chat.title || "New Chat"}
        className="flex-1 min-w-0 text-left truncate px-2.5 py-1.5 text-sm cursor-pointer outline-none"
      >
        {chat.title || "New Chat"}
      </button>

      {/* Dropdown menu trigger for chat actions */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "p-1 mr-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer outline-none transition-opacity",
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100",
          )}
          title="Chat options"
        >
          {isDeleting ? (
            <Loader2 className="size-3.5 animate-spin text-zinc-400" />
          ) : (
            <MoreHorizontal className="size-3.5" />
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={8}
          className="w-36 bg-[#161920] border border-white/10 text-slate-200 shadow-2xl rounded-xl p-1 z-50"
        >
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isDeleting}
            className="cursor-pointer gap-2 py-1.5 px-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 focus:bg-rose-500/10 focus:text-rose-300 outline-none"
          >
            {isDeleting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default memo(ChatItem);
