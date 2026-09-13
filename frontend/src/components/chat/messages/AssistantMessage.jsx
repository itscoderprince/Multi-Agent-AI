import { useState } from "react";
import { CheckCheck, Copy, ExternalLink } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { markdownComponents } from "./markdownComponents";

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
 * Styled after leading AI apps (ChatGPT / Claude / DeepSeek / Perplexity):
 * - Clean transparent background (no card / box borders)
 * - Responsive, sleek media grid for search / vision images
 * - Directly renders formatted markdown text
 * - Minimal copy button icon below the response
 */
export function AssistantMessage({ content, images = [] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanImages = Array.isArray(images)
    ? images.filter(
        (img) =>
          typeof img === "string" &&
          img.trim().length > 0 &&
          (img.startsWith("http://") || img.startsWith("https://"))
      )
    : [];

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

        {/* Markdown Response Content */}
        <div className="text-[15px] leading-relaxed text-slate-200 selection:bg-emerald-500/20">
          <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content}
          </Markdown>
        </div>

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

export default AssistantMessage;
