import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";
import {
  Message,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message";
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  Code2,
  Lightbulb,
  Compass,
} from "lucide-react";

const SUGGESTED_PROMPTS = [
  {
    icon: Code2,
    title: "Build a Web App",
    prompt: "Create a modern React component for a collaborative task board with drag-and-drop support.",
  },
  {
    icon: Lightbulb,
    title: "Brainstorm Ideas",
    prompt: "Give me 5 innovative SaaS project ideas utilizing autonomous multi-agent AI systems.",
  },
  {
    icon: Compass,
    title: "Explain a Concept",
    prompt: "Explain how multi-agent coordination works in distributed AI architectures simply.",
  },
];

const ChatMsg = ({ onSelectPrompt, isGenerating }) => {
  const messages = useSelector((state) => state.messages.messageData);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Welcome State: If no messages in the active thread (or fresh session)
  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32 min-h-0 overflow-y-auto">
        <Empty className="max-w-2xl">
          <EmptyHeader className="mb-4 text-center">
            <EmptyMedia className="mx-auto mb-3">
              <div className="size-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-sky-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                <img
                  src="/favicon.svg"
                  alt="SarthiAi"
                  className="size-8 drop-shadow"
                />
              </div>
            </EmptyMedia>
            <EmptyTitle className="text-xl font-semibold text-slate-100">
              How can SarthiAi help you today?
            </EmptyTitle>
            <EmptyDescription className="text-sm text-zinc-400 max-w-md mx-auto">
              Your autonomous multi-agent AI workspace. Ask questions, explore code, or solve complex problems.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent className="max-w-2xl w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-2">
              {SUGGESTED_PROMPTS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => onSelectPrompt?.(item.prompt)}
                    className="flex flex-col items-start text-left p-3.5 rounded-xl bg-white/5 border border-white/6 hover:bg-white/10 hover:border-white/15 transition-all group cursor-pointer"
                  >
                    <Icon className="size-4 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-slate-200 mb-1">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {item.prompt}
                    </span>
                  </button>
                );
              })}
            </div>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  // Case 3: Conversation has messages (Clean ChatGPT/Claude/DeepSeek style: no avatars/headers)
  return (
    <div className="flex-1 relative min-h-0 flex flex-col w-full h-full overflow-hidden">
      <MessageScrollerProvider>
        <MessageScroller className="flex-1 w-full h-full">
          <MessageScrollerViewport className="px-0 py-4 h-full">
            <MessageScrollerContent className="max-w-3xl mx-auto w-full px-4 space-y-4 pb-32">
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                const isCopied = copiedId === (msg._id || index);

                return (
                  <MessageScrollerItem key={msg._id || index}>
                    <Message
                      align={isUser ? "end" : "start"}
                      className="group/msg"
                    >
                      <MessageContent
                        className={isUser ? "items-end" : "items-start w-full"}
                      >
                        {isUser ? (
                          <div className="max-w-full md:max-w-[85%] rounded-2xl bg-[#212631] border border-white/8 px-4 py-2.5 text-sm text-slate-100 whitespace-pre-wrap break-words leading-relaxed shadow-sm">
                            {msg.content}
                          </div>
                        ) : (
                          <div className="w-full text-slate-200 text-sm md:text-[15px] leading-relaxed break-words py-1">
                            <div className="whitespace-pre-wrap leading-relaxed">
                              {msg.content}
                            </div>

                            <MessageFooter className="px-0 mt-2 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                className="size-7 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
                                title="Copy message"
                                onClick={() =>
                                  handleCopy(msg._id || index, msg.content)
                                }
                              >
                                {isCopied ? (
                                  <Check className="size-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="size-3.5" />
                                )}
                              </Button>
                            </MessageFooter>
                          </div>
                        )}
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                );
              })}

              {/* Clean in-UI typing/thinking indicator when agent is generating */}
              {isGenerating && (
                <MessageScrollerItem>
                  <div className="flex items-center gap-1.5 py-2 px-1 text-zinc-400">
                    <span className="size-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="size-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="size-2 rounded-full bg-zinc-400 animate-bounce" />
                  </div>
                </MessageScrollerItem>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton className="bottom-28 z-30 shadow-lg bg-[#1e2025] hover:bg-[#282d38] border border-white/10 text-white rounded-full size-8" />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  );
};

export default ChatMsg;