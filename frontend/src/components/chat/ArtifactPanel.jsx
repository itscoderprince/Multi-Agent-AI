import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  XIcon,
  CopyIcon,
  CheckIcon,
  CodeIcon,
  PlayIcon,
  FileCodeIcon,
  SparklesIcon,
} from "lucide-react"

export function ArtifactPanel({ artifact, onClose }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    if (!artifact?.code) return
    navigator.clipboard.writeText(artifact.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!artifact) {
    return (
      <aside className="w-full md:w-[480px] lg:w-[540px] shrink-0 border-l bg-background flex flex-col h-full z-10">
        <div className="h-14 border-b px-4 flex items-center justify-between gap-2 shrink-0 bg-muted/20">
          <div className="flex items-center gap-2">
            <FileCodeIcon className="size-4 text-muted-foreground" />
            <span className="font-mono text-sm font-medium text-muted-foreground">
              Code Artifact
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 cursor-pointer"
            onClick={onClose}
            title="Close Panel"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground space-y-3">
          <div className="size-12 rounded-xl bg-muted/50 border flex items-center justify-center">
            <FileCodeIcon className="size-6 opacity-40" />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-foreground">No Artifact Generated Yet</div>
            <div className="text-xs text-muted-foreground max-w-xs">
              Generated code, documents, or component previews will automatically appear in this panel.
            </div>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-full md:w-[480px] lg:w-[540px] shrink-0 border-l bg-background flex flex-col h-full z-10">
      {/* Panel Header */}
      <div className="h-14 border-b px-4 flex items-center justify-between gap-2 shrink-0 bg-muted/20">
        <div className="flex items-center gap-2 overflow-hidden min-w-0">
          <FileCodeIcon className="size-4 text-primary shrink-0" />
          <span className="font-mono text-sm font-semibold truncate">
            {artifact.title || "Artifact.jsx"}
          </span>
          <Badge variant="secondary" className="text-xs uppercase font-mono px-1.5 py-0">
            {artifact.language || "javascript"}
          </Badge>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 cursor-pointer"
            onClick={handleCopy}
            title="Copy Code"
          >
            {copied ? (
              <CheckIcon className="size-4 text-green-500" />
            ) : (
              <CopyIcon className="size-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 cursor-pointer"
            onClick={onClose}
            title="Close Panel"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </div>

      {/* Tabs for Code and Live Preview */}
      <Tabs defaultValue="code" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 pt-3 pb-2 border-b bg-muted/10 shrink-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="code" className="gap-1.5 text-xs cursor-pointer">
              <CodeIcon className="size-3.5" /> Code
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-1.5 text-xs cursor-pointer">
              <PlayIcon className="size-3.5" /> Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="code" className="flex-1 overflow-hidden m-0 p-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <pre className="rounded-lg bg-zinc-950 p-4 text-xs font-mono text-zinc-100 overflow-x-auto leading-relaxed border border-zinc-800 selection:bg-zinc-800">
                <code>{artifact.code}</code>
              </pre>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 overflow-hidden m-0 p-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="size-4 text-primary" />
                    <h4 className="font-semibold text-sm">Interactive Sandbox Preview</h4>
                  </div>
                  <Badge variant="outline" className="text-xs">Live Demo</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Rendered output preview for <span className="font-mono font-medium text-foreground">{artifact.title}</span> generated by Multi-Agent AI system.
                </p>
                <div className="p-8 rounded-lg bg-muted/30 border border-dashed flex flex-col items-center justify-center text-center gap-3">
                  <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl shadow-xs">
                    ⚡
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-sm text-foreground">Interactive Component Sandbox</div>
                    <div className="text-xs text-muted-foreground">Ready for export and runtime compilation</div>
                  </div>
                  <Button size="sm" variant="outline" className="mt-2 text-xs">
                    Run in Playground
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  )
}

export default ArtifactPanel
