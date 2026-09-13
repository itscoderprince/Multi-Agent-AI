import api from "@/utils/axios";

/**
 * Updates an existing chat conversation (e.g. rename title).
 * Sends a PUT request through the API Gateway (/chat/:chatId),
 * which forwards user authentication headers to the Chat Service.
 *
 * @method  PUT
 * @route   /chat/:chatId
 * @param   {string} chatId - Unique MongoDB ObjectId of the conversation.
 * @param   {string|object} updates - New title string or an updates object ({ title }).
 * @returns {Promise<object|null>} Updated chat document from MongoDB, or null if update failed.
 */
export const updateChat = async (chatId, updates) => {
  if (!chatId) return null;

  // Handle local demo conversations
  if (typeof chatId === "string" && chatId.startsWith("demo-")) {
    const title = typeof updates === "string" ? updates : updates?.title;
    return { _id: chatId, title: title || "Demo Chat" };
  }

  try {
    const payload =
      typeof updates === "string" ? { title: updates.trim() } : updates;

    const { data } = await api.put(`/chat/${chatId}`, payload);
    return data?.data ?? data ?? null;
  } catch (error) {
    console.error(
      `Failed to update chat [PUT /chat/${chatId}]:`,
      error.response?.data?.message || error.message,
    );
    return null;
  }
};

export default updateChat;
