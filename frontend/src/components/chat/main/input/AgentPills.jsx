import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, Globe, Code, FileText, Presentation, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const AGENTS = [
  { id: "auto", label: "Auto", icon: Sparkles },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "coding", label: "Coding", icon: Code },
  { id: "search", label: "Search", icon: Globe },
  { id: "pdf", label: "PDF", icon: FileText },
  { id: "ppt", label: "PPT", icon: Presentation },
  { id: "vision", label: "Vision", icon: Eye },
];

export default function AgentPills({ selectedAgent = "auto", onSelectAgent }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1">
      {AGENTS.map(({ id, label, icon: Icon }) => {
        const isSelected = selectedAgent === id;
        return (
          <Badge
            key={id}
            onClick={() => onSelectAgent(id)}
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "cursor-pointer gap-1.5 py-1 px-2.5 rounded-lg text-xs font-medium transition-all shrink-0 select-none",
              isSelected
                ? "bg-primary text-primary-foreground shadow-xs"
                : "border-border/60 hover:bg-accent/60 text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3 w-3 shrink-0" />
            <span>{label}</span>
          </Badge>
        );
      })}
    </div>
  );
}
