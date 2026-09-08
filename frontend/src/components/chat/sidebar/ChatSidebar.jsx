import NewChatButton from "./NewChatButton";
import ChatHistoryList from "./ChatHistoryList";
import UserProfileBar from "./UserProfileBar";
import { Bot } from "lucide-react";

export default function ChatSidebar({
  chats = [],
  activeChatId,
  onSelectChat,
  onNewChat,
  onRenameChat,
  onDeleteChat,
  user,
  onLogout,
  className,
}) {
  return (
    <aside
      className={`w-72 sm:w-80 h-full flex flex-col bg-sidebar/95 backdrop-blur-md border-r border-border/70 shrink-0 select-none ${
        className || ""
      }`}
    >
      {/* Top Section: App Title & New Chat */}
      <div className="p-4 space-y-4 border-b border-border/40">
        <div className="flex items-center gap-2.5 px-1">
          <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight leading-tight">Sarathi AI</h1>
            <p className="text-[11px] text-muted-foreground leading-tight">Multi-Agent Workspace</p>
          </div>
        </div>

        <NewChatButton onNewChat={onNewChat} />
      </div>

      {/* Middle Section: Chat History List */}
      <div className="flex-1 overflow-hidden flex flex-col py-2">
        <div className="px-4 py-1.5 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
          Conversations
        </div>
        <ChatHistoryList
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={onSelectChat}
          onRenameChat={onRenameChat}
          onDeleteChat={onDeleteChat}
        />
      </div>

      {/* Bottom Section: User Profile Bar */}
      <UserProfileBar user={user} onLogout={onLogout} />
    </aside>
  );
}
