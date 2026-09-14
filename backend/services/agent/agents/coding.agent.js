import { groq, getModel } from "../configs/llmModel.js";
import getMemory from "../configs/Memmory.js";
import {
  VALID_INTENTS,
  INTENT_CLASSIFIER_PROMPT,
  SYSTEM_PROMPTS,
} from "../prompts/coding.prompts.js";
import { parseUiFiles } from "../utils/coding.utils.js";

// ─── Fast Intent Classifier (0ms regex matching, eliminates ~700ms LLM overhead) ──

const UI_REGEX =
  /\b(html|css|website|webpage|landing page|ui|frontend|button|calculator|game|clone|component|dashboard|navbar|modal|form)\b/i;
const DEBUG_REGEX =
  /\b(fix|bug|error|issue|broken|not working|fails|exception|crash|debug)\b/i;
const REVIEW_REGEX =
  /\b(review|critique|check my code|audit|inspect|feedback)\b/i;
const OPTIMIZE_REGEX =
  /\b(optimize|faster|speed up|refactor|clean up|performance|memory)\b/i;
const EXPLAIN_REGEX =
  /\b(explain|how does|what does|walk me through|understand)\b/i;
const DOC_REGEX =
  /\b(document|docstring|jsdoc|readme|comments)\b/i;

const classifyIntent = (prompt) => {
  if (UI_REGEX.test(prompt)) return "ui_generation";
  if (DEBUG_REGEX.test(prompt)) return "code_debug";
  if (OPTIMIZE_REGEX.test(prompt)) return "optimization";
  if (REVIEW_REGEX.test(prompt)) return "code_review";
  if (EXPLAIN_REGEX.test(prompt)) return "code_explanation";
  if (DOC_REGEX.test(prompt)) return "documentation";
  return "code_generation";
};

// ─── Coding Agent Node ────────────────────────────────────────────────────────

/**
 * Coding Agent Node
 *
 * Flow:
 *   1. Groq classifies the coding intent (code_generation, ui_generation, debug, etc.)
 *   2. DeepSeek V4 Flash generates production-grade code using the matching system prompt
 *   3. UI requests return clean Markdown for chat + uiFiles array for previews
 *
 * @param {object} state - Current graph state
 * @param {string} state.prompt - User coding query
 * @param {string} [state.chatId] - Active conversation ID (for memory context)
 * @returns {Promise<{ aiResponse: string, uiFiles?: Array<{ name: string, content: string }> }>}
 */
export const codingAgent = async (state) => {
  const { prompt, chatId } = state;

  // 1. Classify intent
  const intent = await classifyIntent(prompt);

  // 2. Load memory (skip for ui_generation to give model full context window)
  const history =
    intent !== "ui_generation"
      ? ((chatId ? await getMemory(chatId) : []) || []).slice(-6)
      : [];

  // 3. Prepare messages
  const messages = [{ role: "system", content: SYSTEM_PROMPTS[intent] }];

  history.forEach(({ role, content }) => {
    if (role && content) {
      messages.push({
        role: role === "assistant" ? "assistant" : "user",
        content,
      });
    }
  });

  const lastMsg = history.at(-1);
  const alreadyInHistory =
    lastMsg?.role === "user" && lastMsg.content.trim() === prompt.trim();
  if (!alreadyInHistory) {
    messages.push({ role: "user", content: prompt });
  }

  // 4. Generate with DeepSeek
  try {
    const res = await getModel("coding").invoke(messages);
    const raw =
      typeof res.content === "string" ? res.content : String(res.content ?? "");

    if (!raw.trim()) {
      console.warn("[codingAgent]: Empty response from DeepSeek.");
      return {
        aiResponse:
          "Unable to generate a response. Please try rephrasing your request.",
      };
    }

    // UI files detection: parse files and format clean Markdown whenever web UI files are produced
    const { aiResponse, uiFiles } = parseUiFiles(raw);
    if (uiFiles.length > 0) {
      console.log(
        `[codingAgent 🖥️]: UI Files detected (${intent}) → ${uiFiles.map((f) => f.name).join(", ")}`
      );
      return { aiResponse, uiFiles };
    }

    return { aiResponse: raw };
  } catch (err) {
    console.error("[codingAgent]: DeepSeek error:", err.message);
    return {
      aiResponse: `Error processing coding request. Please try again.\n\n\`${err.message}\``,
    };
  }
};

export default codingAgent;
