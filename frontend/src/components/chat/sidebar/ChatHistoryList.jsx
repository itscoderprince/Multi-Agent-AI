import { ScrollArea } from "@/components/ui/scroll-area";
import ChatHistoryItem from "./ChatHistoryItem";

export default function ChatHistoryList({
  chats = [],
  activeChatId,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
}) {
  if (!chats || chats.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground/60">
        <p className="text-xs">No chat history yet</p>
        <p className="text-[11px] mt-1 text-muted-foreground/40">Start a new prompt to begin</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 px-3 py-2">
      <div className="space-y-1">
        {chats.map((chat) => (
          <ChatHistoryItem
            key={chat._id || chat.id}
            chat={chat}
            isActive={(chat._id || chat.id) === activeChatId}
            onSelect={onSelectChat}
            onRename={onRenameChat}
            onDelete={onDeleteChat}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
