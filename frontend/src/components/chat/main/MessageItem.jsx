import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, User, Code2, Copy, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MessageItem({ message, onOpenArtifact }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  // Simple code block detection (markdown ```code```)
  const hasCodeBlock = message.content?.includes("```");
  let extractedCode = null;
  let codeLanguage = "javascript";

  if (hasCodeBlock) {
    const match = message.content.match(/```(\w+)?\n([\s\S]*?)```/);
    if (match) {
      codeLanguage = match[1] || "text";
      extractedCode = match[2];
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-3 text-sm leading-relaxed max-w-3xl w-full",
        isUser ? "ml-auto justify-end" : "mr-auto justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 rounded-xl shrink-0 border border-primary/20 bg-primary/10 text-primary mt-0.5 shadow-xs">
          <AvatarFallback className="bg-transparent text-primary">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col gap-1.5", isUser ? "items-end" : "items-start")}>
        {/* Agent identifier badge for assistant */}
        {!isUser && message.agent && (
          <Badge
            variant="outline"
            className="text-[10px] py-0 px-2 h-5 font-normal text-muted-foreground border-border/60 gap-1"
          >
            <Sparkles className="h-2.5 w-2.5 text-primary" />
            <span className="capitalize">{message.agent} agent</span>
          </Badge>
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            "p-4 rounded-2xl shadow-xs transition-all",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-xs font-normal"
              : "bg-card border border-border/70 text-card-foreground rounded-tl-xs space-y-3"
          )}
        >
          <div className="whitespace-pre-wrap break-words">{message.content}</div>

          {/* Action to open in Artifact if code is detected */}
          {!isUser && extractedCode && onOpenArtifact && (
            <div className="pt-2 border-t border-border/40 flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  onOpenArtifact({
                    title: `${codeLanguage}-artifact`,
                    language: codeLanguage,
                    content: extractedCode,
                  })
                }
                className="gap-1.5 h-8 text-xs font-medium rounded-lg"
              >
                <Code2 className="h-3.5 w-3.5" />
                Open Code in Artifact
              </Button>
            </div>
          )}
        </div>

        {/* Action icons below bubble */}
        {!isUser && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pl-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-6 w-6 rounded-md text-muted-foreground hover:text-foreground"
              title="Copy response"
            >
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 rounded-xl shrink-0 border border-border/50 bg-muted text-muted-foreground mt-0.5 shadow-xs">
          <AvatarFallback className="bg-transparent">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
