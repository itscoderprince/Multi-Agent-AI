import ArtifactHeader from "./ArtifactHeader";
import CodeViewer from "./CodeViewer";

export default function ArtifactPanel({
  isOpen,
  artifact,
  onClose,
  className,
}) {
  if (!isOpen) return null;

  const title = artifact?.title || "snippet.js";
  const language = artifact?.language || "javascript";
  const content = artifact?.content || "// No code artifact to display";

  return (
    <aside
      className={`w-full sm:w-[420px] lg:w-[480px] xl:w-[540px] h-full flex flex-col border-l border-border/70 bg-card shrink-0 transition-all duration-300 ease-in-out select-none shadow-xl ${
        className || ""
      }`}
    >
      <ArtifactHeader
        title={title}
        language={language}
        content={content}
        onClose={onClose}
      />

      <CodeViewer content={content} language={language} />
    </aside>
  );
}
