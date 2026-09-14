import { groq } from "../configs/llmModel.js";

const ROUTER_SYSTEM_PROMPT = `You are an agent router. Your job is to classify the user query into exactly ONE agent.

Available agents:
- chat: General conversation, explanations, Q&A, conceptual discussions, casual chit-chat.
- search: Real-time information, current news, live facts, weather, sports scores, web lookup.
- coding: Writing code, debugging, algorithms, technical implementation, software architecture.
- pdf: Generating, exporting, parsing, or analyzing PDF documents.
- ppt: Generating presentations, PowerPoint slides, pitch decks.
- vision: Image generation, visual art creation, drawing, graphic design.

Decision Rules:
1. If query asks for code, programming, or debugging -> coding
2. If query asks for real-time news, current events, or internet lookup -> search
3. If query mentions slides, presentation, deck, or PPT -> ppt
4. If query mentions PDF, document generation, or document analysis -> pdf
5. If query asks to generate, draw, or create an image -> vision
6. For all general conversation, questions, or conceptual help -> chat

Return ONLY the single word (no punctuation, no markdown):
chat
search
coding
pdf
ppt
vision`;

const VALID_AGENTS = new Set(["chat", "search", "coding", "pdf", "ppt", "vision"]);

/**
 * Fast-path regex routing: matches clear, obvious user intent in 0ms without an LLM round-trip.
 */
function fastRoute(prompt) {
  const p = prompt.toLowerCase().trim();

  // Explicit PPT / Presentation
  if (/\b(ppt|powerpoint|slides?|pitch deck|presentation)\b/i.test(p)) {
    return "ppt";
  }

  // Explicit PDF
  if (/\b(pdf|export to pdf|make a pdf|convert to pdf)\b/i.test(p)) {
    return "pdf";
  }

  // Vision / Image generation
  if (/\b(generate (an? )?image|draw (an? )?image|create (an? )?image|make (an? )?image|picture of)\b/i.test(p)) {
    return "vision";
  }

  // Real-time news & web search
  if (/\b(latest news|current weather|stock price|live score|today's news|search the web|search online)\b/i.test(p)) {
    return "search";
  }

  // Obvious Coding / Programming / Artifacts
  if (
    /\b(write code|create a function|debug|fix (the|this)? error|html|css|javascript|typescript|react|vue|node\.?js|python|java|c\+\+|golang|rust|sql query|build a component|build an app|calculator app|todo app)\b/i.test(p) ||
    /```[\s\S]*```/.test(prompt)
  ) {
    return "coding";
  }

  return null;
}

/**
 * Router Agent Node
 * Analyzes the user's prompt using Groq (ultra-fast inference) to classify intent
 * and sets `state.agent` to direct the workflow to the correct agent node.
 *
 * @param {object} state - Current graph state
 * @param {string} state.prompt - User input query
 * @returns {Promise<{ agent: string }>} State update containing the selected agent
 */
export const router = async (state) => {
  const { prompt, agent: requestedAgent } = state;

  // 1. If a valid agent was explicitly requested (not "auto"), bypass LLM classification
  if (requestedAgent && requestedAgent !== "auto" && VALID_AGENTS.has(requestedAgent)) {
    console.log(`[Router 🎯]: Manual agent explicitly selected -> "${requestedAgent}"`);
    return { agent: requestedAgent };
  }

  // 2. Fast-path regex bypass (0ms instant routing for unambiguous intent)
  const fastAgent = fastRoute(prompt);
  if (fastAgent) {
    console.log(`[Router ⚡ Fast-Path]: Instant regex match -> "${fastAgent}" (0ms bypass)`);
    return { agent: fastAgent };
  }

  const preview = prompt.length > 60 ? prompt.slice(0, 60) + "..." : prompt;
  console.log(`[Router 🤖]: Auto-routing prompt -> "${preview}"`);

  try {
    const response = await groq.invoke([
      { role: "system", content: ROUTER_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ]);

    // Sanitize and normalize LLM response
    const detectedAgent = response.content
      .trim()
      .toLowerCase()
      .replace(/[^a-z]/g, "");

    const agent = VALID_AGENTS.has(detectedAgent) ? detectedAgent : "chat";

    console.log(`[Router 🔀]: Auto-switched to agent -> "${agent}" (raw model output: "${response.content.trim()}")`);

    return { agent };
  } catch (error) {
    console.error("[Router ⚠️]: Error during routing, falling back to chat:", error.message);
    return { agent: "chat" };
  }
};

export default router;