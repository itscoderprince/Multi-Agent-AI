import { MessageCircle, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { setSelectChat, deleteChatData } from "@/redux/slices/chatSlice";
import { clearMessageData } from "@/redux/slices/messageSlice";
import deleteChat from "@/features/deleteChat";

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

  const handleDelete = async (e, chatId) => {
    e.stopPropagation();
    const success = await deleteChat(chatId);
    if (success) {
      dispatch(deleteChatData(chatId));
      if (currentChat?._id === chatId) {
        dispatch(clearMessageData());
      }
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
                    className={`group w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-sm text-left transition-colors cursor-pointer outline-none ${
                      isSelected
                        ? "bg-white/10 text-white font-medium"
                        : "text-zinc-300 hover:bg-white/5 hover:text-white focus:bg-white/10 focus:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <MessageCircle className="size-3.5 shrink-0 text-zinc-500" />
                      <span className="truncate flex-1 min-w-0">
                        {chat.title || "New Chat"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, chat._id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-opacity cursor-pointer"
                      title="Delete chat"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
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
