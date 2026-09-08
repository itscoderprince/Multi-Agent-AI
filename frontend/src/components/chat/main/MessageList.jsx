import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Sparkles, Code, Globe, FileText } from "lucide-react";
import MessageItem from "./MessageItem";

export default function MessageList({
  messages = [],
  isLoading,
  onOpenArtifact,
  onSuggestionClick,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const suggestions = [
    { icon: Code, label: "Write a React hook for debounce", query: "Write a custom React hook for debouncing values in TypeScript" },
    { icon: Globe, label: "Search latest tech news", query: "What are the latest breakthroughs in AI this week?" },
    { icon: FileText, label: "Summarize a PDF or document", query: "How can I analyze and summarize complex PDF documents?" },
    { icon: Sparkles, label: "Generate an image or concept", query: "Describe a futuristic neon cyber-city skyline for visual generation" },
  ];

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-xs">
          <Bot className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          What would you like to build today?
        </h2>
        <p className="text-sm text-muted-foreground mt-1 mb-8 max-w-md">
          Sarathi AI automatically routes your request across coding, search, documents, slides, and vision agents.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
          {suggestions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => onSuggestionClick?.(item.query)}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-border/70 bg-card/60 hover:bg-accent/60 hover:border-border transition-all text-left group shadow-xs cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-foreground/90 group-hover:text-foreground">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 px-4 sm:px-8 py-6">
      <div className="space-y-6 max-w-3xl mx-auto">
        {messages.map((msg, idx) => (
          <MessageItem
            key={msg._id || msg.id || idx}
            message={msg}
            onOpenArtifact={onOpenArtifact}
          />
        ))}

        {isLoading && (
          <div className="flex gap-3 text-sm leading-relaxed mr-auto justify-start max-w-3xl w-full">
            <Avatar className="h-8 w-8 rounded-xl shrink-0 border border-primary/20 bg-primary/10 text-primary mt-0.5 shadow-xs">
              <AvatarFallback className="bg-transparent text-primary">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="p-4 rounded-2xl rounded-tl-xs bg-card border border-border/70 shadow-xs flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <span className="text-xs text-muted-foreground font-medium">
                Sarathi AI is thinking and orchestrating agents...
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
