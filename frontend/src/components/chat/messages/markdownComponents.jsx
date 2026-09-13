import { ExternalLink } from "lucide-react";
import CodeBlock from "./CodeBlock";

/**
 * Clean, modern Markdown component mappings inspired by ChatGPT / Claude / Gemini.
 * Emphasizes typography hierarchy, neutral tones, comfortable line heights, and zero visual clutter.
 */
export const markdownComponents = {
  // Headings
  h1: ({ children }) => (
    <h1 className="text-xl font-semibold text-zinc-100 mt-5 mb-2.5 tracking-tight first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold text-zinc-100 mt-4 mb-2 tracking-tight first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-zinc-100 mt-3 mb-1.5 first:mt-0">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-semibold text-zinc-200 mt-2 mb-1 first:mt-0">
      {children}
    </h4>
  ),

  // Paragraphs
  p: ({ children }) => (
    <p className="mb-2.5 first:mt-0 last:mb-0 text-zinc-200 leading-7 text-[15px]">
      {children}
    </p>
  ),

  // Lists (clean neutral markers like ChatGPT)
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-5 my-2 space-y-1 text-zinc-200 text-[15px]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-5 my-2 space-y-1 text-zinc-200 text-[15px]">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-7 pl-1 text-zinc-200 marker:text-zinc-400">
      {children}
    </li>
  ),

  // Blockquotes
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-zinc-600 pl-3.5 my-2.5 text-zinc-300 italic text-[14.5px] leading-relaxed">
      {children}
    </blockquote>
  ),

  // Tables (remark-gfm support)
  table: ({ children }) => (
    <div className="overflow-x-auto my-3 rounded-lg border border-white/10 bg-zinc-900/40">
      <table className="w-full text-left text-xs border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-white/[0.04] text-zinc-200 font-semibold border-b border-white/10">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-white/5">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-3.5 py-2 text-zinc-200 font-medium tracking-wide">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3.5 py-2 text-zinc-300 leading-normal">{children}</td>
  ),

  // Code & Code Blocks
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    const match = /language-(\w+)/.exec(className || "");
    // react-markdown v10+: inline code nodes have no 'className' and a single text child
    const isInline = !className && !String(children).includes("\n");

    if (!isInline) {
      return (
        <CodeBlock language={match ? match[1] : ""}>
          {String(children).replace(/\n$/, "")}
        </CodeBlock>
      );
    }

    // Inline code
    return (
      <code className="px-1.5 py-0.5 rounded-md bg-white/[0.08] text-zinc-100 font-mono text-[13px] font-normal">
        {children}
      </code>
    );
  },

  // Strong & Emphasis
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,

  // Links (ChatGPT / modern AI style)
  a: ({ href, children }) => {
    const text = typeof children === "string" ? children.trim() : "";
    const isNumericCitation = /^\[?\d+\]?$/.test(text);

    if (isNumericCitation) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center min-w-5 h-4.5 px-1.5 mx-0.5 text-[11px] font-mono font-medium rounded-md bg-white/[0.08] hover:bg-white/[0.15] text-zinc-300 hover:text-white border border-white/10 transition-all no-underline select-none align-baseline cursor-pointer"
          title={href}
        >
          {text.replace(/[[\]]/g, "")}
        </a>
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-zinc-200 hover:text-white underline underline-offset-3 decoration-zinc-500 hover:decoration-zinc-300 font-medium transition-colors"
      >
        <span>{children}</span>
        <ExternalLink className="size-3 inline-block opacity-60 shrink-0" />
      </a>
    );
  },

  // Strikethrough (remark-gfm support)
  del: ({ children }) => (
    <del className="line-through text-zinc-500">{children}</del>
  ),

  // Horizontal Rule
  hr: () => <hr className="my-4 border-t border-white/10" />,

  // Task lists (checkboxes)
  input: ({ type, checked, ...props }) => {
    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          checked={checked}
          readOnly
          className="size-3.5 mr-2 rounded accent-zinc-500 cursor-default align-middle"
          {...props}
        />
      );
    }
    return <input type={type} {...props} />;
  },
};

export default markdownComponents;
