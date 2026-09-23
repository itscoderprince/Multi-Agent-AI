import { useState, useMemo, memo } from "react";
import { useDispatch } from "react-redux";
import { CheckCheck, Copy, ExternalLink, Code2, Eye } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { setActiveArtifact } from "@/redux/slices/messageSlice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { markdownComponents } from "./markdownComponents";
import MultiFileCodeBlock from "./MultiFileCodeBlock";

/**
 * Single image card with automatic error removal and smooth fade-in.
 * If the image fails to load or has 0 dimensions / corrupted data, it returns null
 * so that it is completely removed from the grid.
 */
function ImageCard({ url, index }) {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (hasError || !url || typeof url !== "string") return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-zinc-900/40 hover:border-white/25 transition-all duration-300 ${
        loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      title="View full image"
    >
      <img
        src={url}
        alt={`Visual reference ${index + 1}`}
        loading="lazy"
        onLoad={(e) => {
          // If image is corrupt or tiny tracking pixel, remove it
          if (e.currentTarget.naturalWidth < 30 || e.currentTarget.naturalHeight < 30) {
            setHasError(true);
          } else {
            setLoaded(true);
          }
        }}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-sm shadow-sm">
          <ExternalLink className="size-3.5" />
        </span>
      </div>
    </a>
  );
}

/**
 * AssistantMessage component rendering the AI response.
 * Memoized to prevent rerendering markdown and code highlightings on every keystroke or new message.
 */
export function AssistantMessage({ content, images = [], artifact = null, uiFiles = [] }) {
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Resolve files from artifact, direct uiFiles, or parse from markdown headers/JSON
  const resolvedFiles = useMemo(() => {
    if (Array.isArray(artifact?.files) && artifact.files.length > 0) {
      return artifact.files;
    }
    if (Array.isArray(uiFiles) && uiFiles.length > 0) {
      return uiFiles;
    }
    if (!content || typeof content !== "string") return [];

    // Parse markdown headers: ### `index.html` followed by code fence
    const mdFileRegex =
      /###?\s*[`*]*([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)[`*]*\s*\n+```(?:[a-zA-Z0-9_-]+)?\s*\n([\s\S]*?)```/g;
    const parsed = [];
    let m;
    while ((m = mdFileRegex.exec(content)) !== null) {
      parsed.push({ name: m[1].trim(), content: m[2].trim() });
    }
    if (parsed.length > 0) return parsed;

    // Fallback: Check if response is raw JSON with files array
    if (content.includes('"files"') || content.trim().startsWith("{")) {
      try {
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        const rawJson = jsonMatch ? jsonMatch[1].trim() : content.trim();
        const obj = JSON.parse(rawJson);
        if (Array.isArray(obj?.files) && obj.files.length > 0) {
          return obj.files;
        }
      } catch {}
    }

    return [];
  }, [artifact, uiFiles, content]);

  const hasMultiFiles = resolvedFiles.length > 1;

  // If multi-file, strip out the file code fences from markdown so we don't duplicate them
  const textExplanation = useMemo(() => {
    if (!hasMultiFiles || !content) return content;
    return content
      .replace(
        /###?\s*[`*]*([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)[`*]*\s*\n+```(?:[a-zA-Z0-9_-]+)?\s*\n[\s\S]*?```/g,
        ""
      )
      .trim();
  }, [content, hasMultiFiles]);

  const handleOpenArtifact = () => {
    const title =
      artifact?.title ||
      (resolvedFiles[0]?.name?.toLowerCase().endsWith(".html")
        ? "Simple Calculator"
        : resolvedFiles[0]?.name || "Interactive Web Application");

    const payload = {
      id: artifact?.id || Date.now(),
      type: "application/code",
      title,
      files: resolvedFiles,
    };
    dispatch(setActiveArtifact(payload));
  };

  const cleanImages = useMemo(() => {
    return Array.isArray(images)
      ? images.filter(
          (img) =>
            typeof img === "string" &&
            img.trim().length > 0 &&
            (img.startsWith("http://") || img.startsWith("https://"))
        )
      : [];
  }, [images]);

  return (
    <div className="w-full group/msg animate-in fade-in duration-200">
      <div className="w-full text-slate-200 space-y-1.5">
        {/* Clean Responsive Image Grid (like Gemini / ChatGPT / Perplexity) */}
        {cleanImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 my-1.5">
            {cleanImages.slice(0, 8).map((imgUrl, idx) => (
              <ImageCard key={`${imgUrl}-${idx}`} url={imgUrl} index={idx} />
            ))}
          </div>
        )}

        {/* Artifact Card (Claude Artifact / ChatGPT Canvas widget) */}
        {resolvedFiles.length > 0 && (
          <Card
            onClick={handleOpenArtifact}
            className="my-3 cursor-pointer border border-emerald-500/20 bg-[#0d1117] hover:bg-[#121721] hover:border-emerald-500/40 transition-all duration-200 shadow-md group/art p-3.5"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover/art:scale-105 transition-transform">
                  <Code2 className="size-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-100 tracking-tight truncate">
                      {artifact?.title || (resolvedFiles[0]?.name?.toLowerCase().endsWith(".html") ? "Simple Calculator" : resolvedFiles[0]?.name) || "Interactive Web Artifact"}
                    </span>
                    <Badge variant="outline" className="h-4.5 px-1.5 text-[10px] font-mono border-emerald-500/30 text-emerald-400 bg-emerald-500/5">
                      Canvas
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400 font-mono truncate">
                    <span>{resolvedFiles.length} {resolvedFiles.length === 1 ? "file" : "files"}</span>
                    <span>•</span>
                    <span className="truncate">{resolvedFiles.map(f => f.name).join(", ")}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenArtifact();
                }}
                className="shrink-0 gap-1.5 h-8 px-3 text-xs bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 cursor-pointer shadow-xs"
              >
                <Eye className="size-3.5" />
                <span>Open Canvas</span>
              </Button>
            </div>
          </Card>
        )}

        {/* Text Explanation / Intro */}
        {hasMultiFiles && textExplanation ? (
          <div className="text-[15px] leading-relaxed text-slate-200 selection:bg-emerald-500/20">
            <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {textExplanation}
            </Markdown>
          </div>
        ) : null}

        {/* Tabbed Multi-File Code Viewer (Matching User Screenshot: [index.html] [style.css] [script.js]) */}
        {hasMultiFiles ? (
          <MultiFileCodeBlock
            files={resolvedFiles}
            title={artifact?.title || "Simple Calculator"}
          />
        ) : (
          /* Standard Markdown Response Content for Single Files or General Text */
          content && (
            <div className="text-[15px] leading-relaxed text-slate-200 selection:bg-emerald-500/20">
              <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {content}
              </Markdown>
            </div>
          )
        )}

        {/* Action Row with Copy button (shown on hover) */}
        <div
          className={`flex items-center gap-1 mt-1 text-zinc-400 transition-opacity duration-150 ${
            copied ? "opacity-100" : "opacity-0 group-hover/msg:opacity-100"
          }`}
        >
          <Tooltip>
            <TooltipTrigger
              onClick={handleCopy}
              className="flex items-center justify-center size-6 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors outline-none"
              aria-label={copied ? "Copied" : "Copy response"}
            >
              {copied ? (
                <CheckCheck className="size-3.5 text-emerald-400" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={4}>
              {copied ? "Copied!" : "Copy"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default memo(AssistantMessage);
