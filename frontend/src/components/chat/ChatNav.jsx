import { useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck } from "lucide-react";

/**
 * Top navigation bar for the active chat area.
 */
const ChatNav = () => {
  const selectedChat = useSelector((state) => state.chats.selectedChat);

  return (
    <header className="h-13 shrink-0 border-b border-white/8 px-4 flex items-center justify-between bg-[#0a0c10]/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
          <h1
            className="text-sm font-semibold text-slate-100 truncate"
            title={selectedChat?.title || "SarthiAi Workspace"}
          >
            {selectedChat?.title || "SarthiAi Workspace"}
          </h1>
        </div>

        <Badge
          variant="secondary"
          className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-normal rounded-full border border-white/8 bg-white/5 text-slate-300"
        >
          <Sparkles className="size-3 text-emerald-400" />
          <span>Sarthi 2.0</span>
        </Badge>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="xs"
          className="text-xs text-zinc-400 hover:text-white gap-1.5"
          title="Multi-Agent Security Active"
        >
          <ShieldCheck className="size-3.5 text-emerald-400" />
          <span className="hidden md:inline">Protected</span>
        </Button>
      </div>
    </header>
  );
};

export default ChatNav;
