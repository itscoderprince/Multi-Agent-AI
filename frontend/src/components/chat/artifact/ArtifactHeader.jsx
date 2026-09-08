import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, X, FileCode } from "lucide-react";

export default function ArtifactHeader({
  title = "code-snippet",
  language = "javascript",
  content = "",
  onClose,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-14 px-4 border-b border-border/60 bg-muted/30 flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-2.5 min-w-0">
        <FileCode className="h-4 w-4 text-primary shrink-0" />
        <span className="text-xs font-semibold truncate tracking-tight text-foreground">
          {title}
        </span>
        <Badge
          variant="outline"
          className="text-[10px] uppercase font-mono px-1.5 py-0 h-4 border-border/70 text-muted-foreground"
        >
          {language}
        </Badge>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 gap-1.5 text-xs rounded-lg px-2 text-muted-foreground hover:text-foreground"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
          title="Close artifact panel"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </div>
  );
}
