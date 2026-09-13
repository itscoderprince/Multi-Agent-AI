import { useSelector } from "react-redux";
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller";
import ChatEmptyState from "./ChatEmptyState";
import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";
import ThinkingIndicator from "./ThinkingIndicator";

/**
 * Main conversation message viewport.
 * Orchestrates UserMessage, AssistantMessage, ChatEmptyState, and ThinkingIndicator.
 * Adopts a clean DeepSeek / ChatGPT / Groq aesthetic without avatar clutter.
 */
export function ChatMsg({ onSelectPrompt, isGenerating }) {
  const messages = useSelector((state) => state.messages.messageData);

  // Welcome State: If no messages in the active thread
  if (!messages || messages.length === 0) {
    return <ChatEmptyState onSelectPrompt={onSelectPrompt} />;
  }

  return (
    <div className="flex-1 relative min-h-0 flex flex-col w-full h-full overflow-hidden">
      <MessageScrollerProvider>
        <MessageScroller className="flex-1 w-full h-full">
          <MessageScrollerViewport className="px-0 py-2 h-full">
            <MessageScrollerContent className="max-w-3xl mx-auto w-full px-4 gap-0.5 pb-28">
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                const isNewTurn = isUser && index > 0;

                return (
                  <MessageScrollerItem
                    key={msg._id || index}
                    className={isNewTurn ? "mt-3.5" : ""}
                  >
                    {isUser ? (
                      <UserMessage content={msg.content} />
                    ) : (
                      <AssistantMessage content={msg.content} images={msg.images} />
                    )}
                  </MessageScrollerItem>
                );
              })}

              {/* Minimal in-UI Generating / Thinking Indicator */}
              {isGenerating && (
                <MessageScrollerItem>
                  <ThinkingIndicator />
                </MessageScrollerItem>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton className="bottom-28 z-30 shadow-lg bg-[#1e2025] hover:bg-[#282d38] border border-white/10 text-white rounded-full size-8" />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  );
}

export default ChatMsg;
