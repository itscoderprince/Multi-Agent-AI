import api from "@/utils/axios";

/**
 * Creates a new chat thread for the authenticated user in the backend.
 * Sends a POST request through API Gateway (/chat or /chats),
 * which injects user session headers ('x-user-id') and routes to Chat Service.
 *
 * @method  POST
 * @route   /chat (or /chats)
 * @param   {string} [title="New Chat"] - Custom conversation title.
 * @returns {Promise<object|null>} The newly created chat document from MongoDB, or null if creation failed.
 */
export const createChat = async (title = "New Chat") => {
  try {
    const cleanTitle =
      typeof title === "string" && title.trim() ? title.trim() : "New Chat";

    const { data } = await api.post("/chat", { title: cleanTitle });
    return data?.data || data || null;
  } catch (error) {
    console.error(
      "Failed to create chat [POST /chat]:",
      error.response?.data?.message || error.message,
    );
    return null;
  }
};

export default createChat;
