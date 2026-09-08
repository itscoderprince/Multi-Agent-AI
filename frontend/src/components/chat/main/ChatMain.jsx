import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInputDock from "./input/ChatInputDock";

export default function ChatMain({
  chatTitle,
  activeAgent,
  isArtifactOpen,
  onToggleArtifact,
  hasArtifact,
  messages = [],
  isLoading,
  selectedAgent,
  onSelectAgent,
  onSend,
  onStop,
  onOpenArtifact,
  onSuggestionClick,
  className,
}) {
  return (
    <main
      className={`flex-1 flex flex-col h-full overflow-hidden bg-background relative min-w-0 ${
        className || ""
      }`}
    >
      <ChatHeader
        title={chatTitle}
        activeAgent={activeAgent}
        isArtifactOpen={isArtifactOpen}
        onToggleArtifact={onToggleArtifact}
        hasArtifact={hasArtifact}
      />

      <div className="flex-1 min-h-0 overflow-hidden flex flex-col relative">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onOpenArtifact={onOpenArtifact}
          onSuggestionClick={onSuggestionClick}
        />
      </div>

      <ChatInputDock
        selectedAgent={selectedAgent}
        onSelectAgent={onSelectAgent}
        onSend={onSend}
        isLoading={isLoading}
        onStop={onStop}
      />
    </main>
  );
}
