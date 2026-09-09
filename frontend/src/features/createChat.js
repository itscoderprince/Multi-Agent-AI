import api from "@/utils/axios";

/**
 * Creates a new chat thread for the authenticated user.
 * Sends a POST request to Gateway (/chat), which injects auth credentials
 * and forwards to the Chat Service.
 *
 * @param {string} [title="New Chat"] - Optional custom title for the chat.
 * @returns {Promise<object|null>} The created chat document, or null if creation failed.
 */
export const createChat = async (title = "New Chat") => {
  try {
    const { data } = await api.post("/chat", { title });
    return data?.data || data || null;
  } catch (error) {
    console.error(
      "Failed to create chat:",
      error.response?.data?.message || error.message,
    );
    return null;
  }
};

export default createChat;


