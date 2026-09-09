import { MessageCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { setSelectChat } from "@/redux/slices/chatSlice";

/**
 * Dropdown menu for recent chats displayed when the sidebar is collapsed.
 */
const RecentChatsDropdown = ({ chats, selectedChat, onSelectChat }) => {
  const dispatch = useDispatch();
  const reduxChats = useSelector((state) => state.chats.chatData);
  const reduxSelectedChat = useSelector((state) => state.chats.selectedChat);

  const chatList = chats ?? reduxChats ?? [];
  const currentChat = selectedChat ?? reduxSelectedChat;

  const handleSelect = (chat) => {
    if (onSelectChat) {
      onSelectChat(chat);
    } else {
      dispatch(setSelectChat(chat));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title="Recent chats"
        aria-label="Recent chats"
        className="flex items-center justify-center size-8 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 cursor-pointer transition-colors outline-none mx-auto"
      >
        <MessageCircle className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={12}
        className="w-64 bg-[#1e2025] border border-white/10 text-slate-200 shadow-2xl rounded-2xl p-2 overflow-hidden"
      >
        <div className="px-2.5 py-1.5 text-xs font-semibold text-zinc-400">
          Recent Chats
        </div>

        <ScrollArea className="max-h-52 w-full mt-1">
          <div className="space-y-0.5 pr-1.5">
            {!chatList.length ? (
              <p className="text-xs text-zinc-500 px-2 py-4 text-center">
                No recent conversations
              </p>
            ) : (
              chatList.map((chat) => {
                const isSelected = currentChat?._id === chat._id;
                return (
                  <DropdownMenuItem
                    key={chat._id}
                    onClick={() => handleSelect(chat)}
                    title={chat.title || "New Chat"}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-left transition-colors cursor-pointer outline-none ${
                      isSelected
                        ? "bg-white/10 text-white font-medium"
                        : "text-zinc-300 hover:bg-white/5 hover:text-white focus:bg-white/10 focus:text-white"
                    }`}
                  >
                    <MessageCircle className="size-3.5 shrink-0 text-zinc-500" />
                    <span className="truncate flex-1 min-w-0">
                      {chat.title || "New Chat"}
                    </span>
                  </DropdownMenuItem>
                );
              })
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RecentChatsDropdown;
