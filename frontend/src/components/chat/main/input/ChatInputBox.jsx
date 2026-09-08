import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip, Square } from "lucide-react";

export default function ChatInputBox({ onSend, isLoading, onStop }) {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef(null);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [prompt]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!prompt.trim() || isLoading) return;
    onSend(prompt.trim());
    setPrompt("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="relative flex items-end gap-2 px-3 pb-2.5 pt-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground shrink-0"
        title="Attach file (PDF/Image)"
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      <textarea
        ref={textareaRef}
        rows={1}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask Sarathi AI anything... (Shift+Enter for newline)"
        className="flex-1 max-h-[180px] bg-transparent resize-none border-0 text-sm focus:outline-hidden focus:ring-0 p-2 text-foreground placeholder:text-muted-foreground/60 leading-relaxed"
      />

      <div className="shrink-0 mb-0.5">
        {isLoading ? (
          <Button
            type="button"
            size="icon"
            onClick={onStop}
            className="h-9 w-9 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all shadow-xs"
            title="Stop generation"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
          </Button>
        ) : (
          <Button
            type="button"
            size="icon"
            onClick={handleSubmit}
            disabled={!prompt.trim()}
            className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs disabled:opacity-30 disabled:cursor-not-allowed"
            title="Send prompt"
          >
            <ArrowUp className="h-4 w-4 stroke-[2.5]" />
          </Button>
        )}
      </div>
    </div>
  );
}
