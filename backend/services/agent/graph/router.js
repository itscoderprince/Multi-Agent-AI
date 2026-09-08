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
 * Router Agent Node
 * Analyzes the user's prompt using Groq (ultra-fast inference) to classify intent
 * and sets `state.agent` to direct the workflow to the correct agent node.
 *
 * @param {object} state - Current graph state
 * @param {string} state.prompt - User input query
 * @returns {Promise<{ agent: string }>} State update containing the selected agent
 */
export const router = async (state) => {
  const { prompt } = state;

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

    return { agent };
  } catch (error) {
    console.error("[Router]: Error during routing, falling back to chat:", error.message);
    return { agent: "chat" };
  }
};

export default router;