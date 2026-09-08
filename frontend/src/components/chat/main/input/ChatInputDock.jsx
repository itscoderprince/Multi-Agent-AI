import AgentPills from "./AgentPills";
import ChatInputBox from "./ChatInputBox";

export default function ChatInputDock({
  selectedAgent,
  onSelectAgent,
  onSend,
  isLoading,
  onStop,
}) {
  return (
    <div className="p-4 sm:p-6 pt-2 bg-gradient-to-t from-background via-background/90 to-transparent">
      <div className="max-w-3xl mx-auto rounded-2xl border border-border/80 bg-card/70 backdrop-blur-xl shadow-lg focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all p-2 space-y-1.5">
        <AgentPills
          selectedAgent={selectedAgent}
          onSelectAgent={onSelectAgent}
        />
        <div className="border-t border-border/40" />
        <ChatInputBox
          onSend={onSend}
          isLoading={isLoading}
          onStop={onStop}
        />
      </div>
      <p className="text-center text-[11px] text-muted-foreground/60 mt-2">
        Sarathi AI may make mistakes. Verify important information.
      </p>
    </div>
  );
}
