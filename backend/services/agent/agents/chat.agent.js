import { getModel } from "../configs/llmModel.js";

/**
 * Chat Agent Node
 * Core conversational assistant (Sarathi AI).
 * Handles general conversation, explanations, and synthesizes search results if provided.
 *
 * @param {object} state - Current graph state
 * @param {string} state.prompt - User query
 * @param {string} [state.aiResponse] - Context or search findings from prior node
 * @returns {Promise<{ aiResponse: string }>} State update with Sarathi AI response
 */
export const chatAgent = async (state) => {
  const { prompt, aiResponse } = state;
  const llm = getModel("chat");

  const systemPrompt = `You are Sarathi AI, an intelligent, versatile, and friendly AI assistant.
Provide clear, helpful, well-structured, and accurate responses. Format with clean markdown where appropriate.`;

  const messages = [
    { role: "system", content: systemPrompt },
  ];

  // If previous node (e.g. searchAgent) provided real-time context/findings, inject it
  if (aiResponse) {
    messages.push({
      role: "system",
      content: `Context / Search findings from web:\n${aiResponse}\n\nPlease use this information to synthesize a comprehensive, accurate answer for the user.`,
    });
  }

  messages.push({
    role: "user",
    content: prompt,
  });

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