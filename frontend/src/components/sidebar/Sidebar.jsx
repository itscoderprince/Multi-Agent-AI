import { MessageCirclePlus, PanelLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fetchData from "@/features/fetchData";
import NavUser from "./NavUser";
import RecentChatsDropdown from "./RecentChatsDropdown";
import ChatItem from "./ChatItem";
import {
  setChatData,
  setSelectChat,
} from "@/redux/slices/chatSlice";
import { clearMessageData } from "@/redux/slices/messageSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const chats = useSelector((state) => state.chats.chatData);
  const selectedChat = useSelector((state) => state.chats.selectedChat);
  const user = useSelector((state) => state.user.userData);

  // Fetch real user chats on mount and sync to Redux
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await fetchData("/chat");
        // Filter out any legacy blank dummy chats titled "New Chat"
        const userChats = Array.isArray(data)
          ? data.filter((chat) => chat.title && chat.title.trim() !== "New Chat")
          : [];

        dispatch(setChatData(userChats));
      } catch (err) {
        console.error("Failed to fetch chats:", err);
        dispatch(setChatData([]));
      }
    };

    fetchChats();
  }, [dispatch]);

  // Reset to fresh welcome state without creating empty DB rows
  const handleCreateChat = () => {
    dispatch(setSelectChat(null));
    dispatch(clearMessageData());
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 h-screen shrink-0 border-r border-white/6 bg-[#0d0f14] flex flex-col transition-[width] duration-200 ease-in-out ${
        collapsed ? "w-12" : "w-65.25"
      }`}
    >
      <div
        className={`flex items-center py-3 ${
          collapsed ? "justify-center px-2" : "justify-between px-3.5"
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="/favicon.svg"
              alt="SarthiAi"
              className="size-7 shrink-0"
            />
            <span className="text-lg font-semibold text-slate-100 tracking-wide truncate">
              SarthiAi
            </span>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon-sm"
          className="relative group hidden lg:inline-flex text-muted-foreground hover:text-white cursor-pointer overflow-hidden"
          aria-label="Toggle sidebar"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {collapsed ? (
            <>
              <img
                src="/favicon.svg"
                alt="SarthiAi"
                className="size-7 shrink-0 transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:scale-75"
              />
              <PanelLeftIcon className="absolute size-4 opacity-0 scale-75 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100" />
            </>
          ) : (
            <PanelLeftIcon className="size-4 transition-transform duration-200 group-hover:scale-105" />
          )}
        </Button>
      </div>

      <div className={`pt-3 pb-2 ${collapsed ? "px-2" : "px-3.5"}`}>
        {!collapsed ? (
          <Button
            onClick={handleCreateChat}
            className="w-full h-9 rounded-full justify-center gap-2 font-medium shadow-sm transition-transform active:scale-[0.98] cursor-pointer bg-white text-zinc-900 hover:bg-zinc-200"
          >
            <MessageCirclePlus className="size-4" />
            <span>New Chat</span>
          </Button>
        ) : (
          <Button
            onClick={handleCreateChat}
            variant="ghost"
            size="icon-sm"
            className="w-full justify-center text-muted-foreground hover:text-white cursor-pointer"
            aria-label="New chat"
          >
            <MessageCirclePlus />
          </Button>
        )}
      </div>

      {collapsed ? (
        <div className="flex justify-center px-2 py-2">
          <RecentChatsDropdown
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={(chat) => dispatch(setSelectChat(chat))}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-2 py-2 text-sm space-y-4">
          {/* User's Recent Chats */}
          {chats && chats.length > 0 ? (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                Recent
              </div>
              <div className="space-y-0.5">
                {chats.map((chat) => (
                  <ChatItem
                    key={chat._id}
                    chat={chat}
                    isSelected={selectedChat?._id === chat._id}
                    onSelect={() => dispatch(setSelectChat(chat))}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="px-3 py-6 text-center text-xs text-zinc-500">
              No conversations yet
            </div>
          )}
        </div>
      )}

      <div className="p-2.5 mt-auto">
        <NavUser user={user} collapsed={collapsed} />
      </div>
    </aside>
  );
};

export default Sidebar;
