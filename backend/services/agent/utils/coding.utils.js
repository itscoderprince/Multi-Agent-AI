/**
 * Coding Agent Utilities
 * Helpers for parsing, formatting, and normalizing code outputs.
 */

const EXT_TO_LANG = {
  html: "html",
  css: "css",
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  json: "json",
  py: "python",
  sql: "sql",
  sh: "bash",
};

/**
 * Formats an array of file objects into clean Markdown code blocks.
 * @param {Array<{ name: string, content: string }>} files
 * @param {string} [intro=""]
 * @returns {string} Markdown text
 */
export const filesToMarkdown = (files, intro = "") => {
  if (!Array.isArray(files) || files.length === 0) return "";
  const blocks = files.map((file) => {
    const ext = (file.name || "").split(".").pop().toLowerCase();
    const lang = EXT_TO_LANG[ext] || "";
    return `### \`${file.name}\`\n\`\`\`${lang}\n${(file.content || "").trim()}\n\`\`\``;
  });
  return (intro ? `${intro.trim()}\n\n` : "") + blocks.join("\n\n");
};

/**
 * Parses UI generation output from LLM.
 * Handles:
 *   1. Clean or fenced JSON with a "files" array
 *   2. Markdown with file headings (### `filename` followed by code fence)
 *   3. Salvaging files from truncated/broken JSON
 *
 * Always returns a clean Markdown string for chat rendering AND a uiFiles array.
 *
 * @param {string} raw - Raw LLM response string
 * @returns {{ aiResponse: string, uiFiles: Array<{ name: string, content: string }> }}
 */
export const parseUiFiles = (raw) => {
  if (!raw || typeof raw !== "string" || !raw.trim()) {
    return {
      aiResponse: "Unable to generate UI code. Please try rephrasing your request.",
      uiFiles: [],
    };
  }

  const trimmed = raw.trim();

  // 1. Try Markdown file headers (### `index.html` followed by code fence)
  const mdFileRegex =
    /###?\s*[`*]*([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)[`*]*\s*\n+```(?:[a-zA-Z0-9_-]+)?\s*\n([\s\S]*?)```/g;
  const mdFiles = [];
  let m;
  while ((m = mdFileRegex.exec(trimmed)) !== null) {
    mdFiles.push({ name: m[1].trim(), content: m[2].trim() });
  }
  if (mdFiles.length > 0) {
    return {
      aiResponse: trimmed,
      uiFiles: mdFiles,
    };
  }

  // 2. Try JSON parsing (clean or fenced)
  let jsonCandidate = trimmed;
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonCandidate = fenceMatch[1].trim();
  } else {
    const s = trimmed.indexOf("{");
    const e = trimmed.lastIndexOf("}");
    if (s !== -1 && e !== -1 && e > s) {
      jsonCandidate = trimmed.slice(s, e + 1);
    }
  }

  try {
    const parsed = JSON.parse(jsonCandidate);
    if (Array.isArray(parsed?.files) && parsed.files.length > 0) {
      return {
        aiResponse: filesToMarkdown(parsed.files),
        uiFiles: parsed.files,
      };
    }
  } catch {
    // Fall through to regex extraction
  }

  // 3. Fallback: regex extraction from broken or truncated JSON
  if (trimmed.includes('"files"') || trimmed.startsWith("{")) {
    const fileItemRegex =
      /"name"\s*:\s*"([^"]+)"\s*,\s*"content"\s*:\s*"((?:[^"\\]|\\.)*)/g;
    const salvaged = [];
    let itemMatch;
    while ((itemMatch = fileItemRegex.exec(trimmed)) !== null) {
      const name = itemMatch[1].trim();
      const content = itemMatch[2]
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
      salvaged.push({ name, content: content.trim() });
    }
    if (salvaged.length > 0) {
      return {
        aiResponse: filesToMarkdown(salvaged),
        uiFiles: salvaged,
      };
    }
  }

  // 4. Default: return raw markdown/text
  return {
    aiResponse: trimmed,
    uiFiles: [],
  };
};

export default parseUiFiles;
