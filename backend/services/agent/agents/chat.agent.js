import { getModel } from "../configs/llmModel.js";
import getMemory from "../configs/Memmory.js";

const SYSTEM_PROMPT = `You are Sarathi AI (also known as SarthiAi), an intelligent, highly knowledgeable, and efficient autonomous AI assistant.

Rules:
- For simple questions, greetings, casual chit-chat, and short queries, respond naturally, warmly, and concisely in plain text without unnecessary headers.
- For technical, educational, coding, architectural, or detailed topics, provide structured, precise, and highly readable explanations using clean Markdown.
- Focus on accuracy, efficiency, correctness, and actionable clarity. Avoid repetitive filler phrases.

Formatting Guidelines:
- Use # for main titles and ## for sections.
- Always leave a blank line after headings.
- Use bullet points (-) for lists, features, or bulleted concepts.
- Use numbered lists (1., 2.) for sequential steps, guides, or workflows.
- Use fenced code blocks with explicit language tags (e.g. \`\`\`javascript, \`\`\`python, \`\`\`bash, \`\`\`json) for all code snippets.
- Use backticks (\`code\`) for variable names, inline functions, terminal commands, and file paths.
- Keep paragraphs short (2-4 sentences max) and easily scannable.
- Never write headings and content on the same line.
- Never generate large, dense walls of unformatted text.
- Use Markdown tables for comparative matrices, specifications, or structured data when appropriate.
- When synthesizing web search findings, cite sources naturally using Markdown links [Source Title](url) or numbered references.`;

/**
 * Chat Agent Node
 * Core conversational assistant (Sarathi AI).
 * Handles general conversation, explanations, coding guidance, and synthesizes search results if provided.
 *
 * @param {object} state - Current graph state
 * @param {string} state.prompt - User query
 * @param {string} [state.aiResponse] - Context or search findings from prior node
 * @returns {Promise<{ aiResponse: string }>} State update with Sarathi AI response
 */
/**
 * Normalizes LLM response content to a plain string.
 * Gemini can return an array of content parts; Groq returns a string.
 */
const extractText = (content) => {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === "string" ? part : part?.text ?? ""))
      .join("");
  }
  return String(content ?? "");
};

export const chatAgent = async (state) => {
  const { prompt, aiResponse, searchResults, chatId } = state;
  const targetAgent = searchResults || state.agent === "search" ? "search" : "chat";
  const llm = getModel(targetAgent);

  const rawHistory = chatId ? await getMemory(chatId) : [];
  // Keep only the most recent 6 messages to stay well within token thresholds
  const history = (rawHistory || []).slice(-6);

  // 1. Incorporate web search findings directly into system prompt (MUST be the first and only system message)
  const searchData = searchResults || aiResponse;
  let systemContent = SYSTEM_PROMPT;
  if (searchData) {
    systemContent += `\n\n--- SEARCH FINDINGS / WEB CONTEXT ---\n${searchData}\n\nSynthesize the above web search findings directly into a complete, clear, and comprehensive answer for the user adhering to all formatting rules.`;
  }

  const messages = [
    { role: "system", content: systemContent },
  ];

  // 2. Inject previous conversation history
  if (history?.length) {
    history.forEach((msg) => {
      if (msg.role && msg.content) {
        messages.push({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content,
        });
      }
    });
  }

  // 3. Append current user prompt if not already in history
  const lastMsg = history[history.length - 1];
  const isPromptInHistory =
    lastMsg &&
    lastMsg.role === "user" &&
    lastMsg.content.trim() === prompt.trim();

  if (!isPromptInHistory) {
    messages.push({
      role: "user",
      content: prompt,
    });
  }

  const tryInvoke = async (model, label) => {
    try {
      const response = await model.invoke(messages);
      const text = extractText(response.content);
      if (!text.trim()) {
        // Model returned empty — likely safety-blocked
        console.warn(`[chatAgent][${label}]: Empty response (possible safety block). Skipping.`);
        return null;
      }
      return text;
    } catch (err) {
      console.warn(`[chatAgent][${label}]: Error — ${err.message}`);
      return null;
    }
  };

  // Primary model
  const primary = await tryInvoke(llm, targetAgent === "search" ? "gemini" : "groq");
  if (primary) return { aiResponse: primary };

  // Fallback: if primary was Gemini, try Groq (and vice versa)
  const fallbackLlm = getModel(targetAgent === "search" ? "chat" : "search");
  const fallback = await tryInvoke(fallbackLlm, targetAgent === "search" ? "groq-fallback" : "gemini-fallback");
  if (fallback) return { aiResponse: fallback };

  // Last resort
  console.error("[chatAgent]: All models failed or returned empty responses.");
  return {
    aiResponse: "I'm sorry, I was unable to generate a response. This may be due to content filtering. Please try rephrasing your question.",
  };
};

export default chatAgent;