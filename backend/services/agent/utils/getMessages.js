import axios from "axios";

/**
 * Fetches conversation history from the Chat Microservice for a given chatId.
 *
 * @param {string} chatId - The conversation / chat ID.
 * @param {object|string} [options={}] - Additional options or user ID string.
 * @param {string} [options.userId] - Optional user ID for tracing/auth headers.
 * @returns {Promise<Array<object>>} List of message documents (sorted chronologically) or an empty array on failure.
 */
export const getMessages = async (chatId, options = {}) => {
  if (!chatId) {
    return [];
  }

  const userId = typeof options === "string" ? options : options?.userId;
  const chatServiceUrl = process.env.CHAT_SERVICE || "http://localhost:3000";

  try {
    const headers = {};
    if (userId) {
      headers["x-user-id"] = userId;
    }

    const response = await axios.get(`${chatServiceUrl}/${chatId}/messages`, {
      headers,
      timeout: 5000,
    });

    // Chat Service standard response: { success: true, message: "...", data: Message[] }
    const messages = response.data?.data;
    if (Array.isArray(messages)) {
      return messages;
    }

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(
      `[getMessages] Failed to fetch messages for chatId "${chatId}":`,
      error.response?.data?.message || error.message
    );
    return [];
  }
};

export default getMessages;