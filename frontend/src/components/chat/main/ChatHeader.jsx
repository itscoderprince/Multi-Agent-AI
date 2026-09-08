import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Code2, PanelRightClose, PanelRightOpen } from "lucide-react";

export default function ChatHeader({
  title = "New Chat",
  activeAgent = "auto",
  isArtifactOpen,
  onToggleArtifact,
  hasArtifact,
}) {
  return (
    <header className="h-14 px-6 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-3 min-w-0">
        <h2 className="text-sm font-semibold truncate tracking-tight text-foreground">
          {title}
        </h2>
        <Badge
          variant="secondary"
          className="gap-1.5 py-0.5 px-2 text-[11px] font-medium bg-primary/10 text-primary border-primary/20 shrink-0"
        >
          <Sparkles className="h-3 w-3" />
          <span className="capitalize">{activeAgent}</span>
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={isArtifactOpen ? "secondary" : "ghost"}
          size="sm"
          onClick={onToggleArtifact}
          className="h-8 gap-1.5 text-xs rounded-lg px-2.5"
          title={isArtifactOpen ? "Hide code artifact panel" : "View code artifact panel"}
        >
          <Code2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Artifact</span>
          {isArtifactOpen ? (
            <PanelRightClose className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
          ) : (
            <PanelRightOpen className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
          )}
          {hasArtifact && !isArtifactOpen && (
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          )}
        </Button>
      </div>
    </header>
  );
}
