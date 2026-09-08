/**
 * Web Search Agent Node
 * Handles queries requiring live web search, retrieval, and fact-checking.
 *
 * @param {object} state - Current graph state
 * @param {string} state.prompt - Search query or factual question
 * @returns {Promise<{ aiResponse: string }>} State update
 */
export const searchAgent = async (state) => {
  const { prompt } = state;

  // TODO: Integrate web search tool (e.g. Tavily, Serper, Google Search)
  const response = `[Search Agent]: Searching web sources for "${prompt}"`;

  return {
    aiResponse: response,
  };
};

export default searchAgent;
