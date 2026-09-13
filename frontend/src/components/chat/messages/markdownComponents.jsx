import CodeBlock from "./CodeBlock";

/**
 * Custom Markdown component mappings for high-contrast, beautiful AI responses.
 * Designed to render react-markdown + remark-gfm output with maximum readability.
 */
export const markdownComponents = {
  // Headings
  h1: ({ children }) => (
    <h1 className="text-lg md:text-xl font-bold text-white mt-4 mb-2 tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-base md:text-lg font-semibold text-white mt-4 mb-2 tracking-tight pb-1 border-b border-white/8">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm md:text-base font-semibold text-slate-100 mt-3 mb-1.5">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-xs md:text-sm font-semibold text-slate-200 mt-2.5 mb-1">
      {children}
    </h4>
  ),

  // Paragraphs
  p: ({ children }) => (
    <p className="my-1.5 first:mt-0 last:mb-0 text-slate-200 leading-relaxed text-[15px]">
      {children}
    </p>
  ),

  // Lists
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-5 my-2.5 space-y-1.5 text-slate-200 text-[15px]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-5 my-2.5 space-y-1.5 text-slate-200 text-[15px]">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed pl-1 marker:text-emerald-400/80">
      {children}
    </li>
  ),

  // Blockquotes
  blockquote: ({ children }) => (
    <blockquote className="border-l-3 border-emerald-400/90 bg-emerald-500/5 px-4 py-2.5 my-3 rounded-r-xl text-slate-300 italic text-[14px] leading-relaxed">
      {children}
    </blockquote>
  ),

  // Tables (remark-gfm support)
  table: ({ children }) => (
    <div className="overflow-x-auto my-3.5 rounded-xl border border-white/10 bg-[#090b10] shadow-md">
      <table className="w-full text-left text-xs border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-white/[0.05] text-slate-200 font-semibold border-b border-white/10">
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
    <th className="px-4 py-2.5 text-slate-200 font-medium tracking-wide">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2.5 text-slate-300 leading-normal">{children}</td>
  ),

  // Code & Code Blocks
  pre: ({ children }) => <>{children}</>,
  code: ({ inline, className, children }) => {
    const match = /language-(\w+)/.exec(className || "");
    const isMultiline = String(children).includes("\n");

    if (!inline && (match || isMultiline)) {
      return (
        <CodeBlock language={match ? match[1] : ""}>
          {String(children).replace(/\n$/, "")}
        </CodeBlock>
      );
    }

    return (
      <code className="px-1.5 py-0.5 rounded-md bg-[#181d28] border border-white/10 text-emerald-300 font-mono text-[13px] font-normal">
        {children}
      </code>
    );
  },

  // Strong & Emphasis
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-slate-300">{children}</em>,

  // Links
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors font-medium"
    >
      {children}
    </a>
  ),

  // Horizontal Rule
  hr: () => <hr className="my-5 border-t border-white/10" />,

  // Task lists (checkboxes)
  input: ({ type, checked, ...props }) => {
    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          checked={checked}
          readOnly
          className="size-3.5 mr-2 rounded accent-emerald-500 cursor-default align-middle"
          {...props}
        />
      );
    }
    return <input type={type} {...props} />;
  },
};

export default markdownComponents;
