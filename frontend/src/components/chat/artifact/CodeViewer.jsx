import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Eye } from "lucide-react";

export default function CodeViewer({ content = "", language = "javascript" }) {
  const lines = content ? content.split("\n") : ["// No code generated yet"];

  return (
    <Tabs defaultValue="code" className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b border-border/40 bg-muted/10 flex items-center justify-between">
        <TabsList className="h-7 p-0.5 bg-muted/60">
          <TabsTrigger value="code" className="text-xs h-6 px-2.5 gap-1.5 data-[state=active]:bg-background">
            <Code className="h-3 w-3" />
            <span>Code</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="text-xs h-6 px-2.5 gap-1.5 data-[state=active]:bg-background">
            <Eye className="h-3 w-3" />
            <span>Preview</span>
          </TabsTrigger>
        </TabsList>
        <span className="text-[11px] text-muted-foreground/60 font-mono">
          {lines.length} lines
        </span>
      </div>

      <TabsContent value="code" className="flex-1 m-0 overflow-hidden bg-zinc-950 text-zinc-100 font-mono text-xs">
        <ScrollArea className="h-full">
          <div className="p-4 flex gap-4 select-text leading-relaxed">
            {/* Line numbers */}
            <div className="select-none text-zinc-600 text-right pr-2 shrink-0 border-r border-zinc-800">
              {lines.map((_, i) => (
                <div key={i} className="leading-relaxed">
                  {i + 1}
                </div>
              ))}
            </div>
            {/* Code content */}
            <pre className="flex-1 overflow-x-auto whitespace-pre leading-relaxed text-zinc-200">
              <code>{content}</code>
            </pre>
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="preview" className="flex-1 m-0 p-6 overflow-auto bg-background">
        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-xl p-8 text-center">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
            <Eye className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-semibold">Live Sandbox Preview</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Live DOM / component execution preview for {language}.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
