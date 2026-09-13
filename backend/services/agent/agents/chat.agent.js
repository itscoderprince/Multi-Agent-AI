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
- Use Markdown tables for comparative matrices, specifications, or structured data when appropriate.`;

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
export const chatAgent = async (state) => {
  const { prompt, aiResponse, chatId } = state;
  const llm = await getModel("chat");

  const history = chatId ? await getMemory(chatId) : [];

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  // 1. Inject previous conversation history
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

  // 2. Append current prompt if not already in history
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

  // 3. Inject web search context if provided
  if (aiResponse) {
    messages.push({
      role: "system",
      content: `Context / Search findings from web:\n${aiResponse}\n\nPlease synthesize this context into a comprehensive, accurate, and direct response for the user adhering to all formatting rules.`,
    });
  }

  try {
    const response = await llm.invoke(messages);

    return {
      aiResponse: response.content,
    };
  } catch (error) {
    console.error("[chatAgent]: Error invoking LLM:", error.message);
    return {
      aiResponse: "I encountered an issue processing your request. Please try again.",
    };
  }
};

export default chatAgent;