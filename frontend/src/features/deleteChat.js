import api from "@/utils/axios";

/**
 * Permanently deletes a chat conversation and all associated messages.
 * Sends a DELETE request through API Gateway (/chat/:chatId or /chats/:chatId),
 * which forwards the user authentication headers to the Chat Service.
 *
 * @method  DELETE
 * @route   /chat/:chatId (or /chats/:chatId)
 * @param   {string} chatId - The unique MongoDB ObjectId of the conversation.
 * @returns {Promise<boolean>} True if successfully deleted from database (or demo), false otherwise.
 */
export const deleteChat = async (chatId) => {
  if (!chatId) return false;

  // Local demo conversations exist on the client for exploration
  if (typeof chatId === "string" && chatId.startsWith("demo-")) {
    return true;
  }

  try {
    await api.delete(`/chat/${chatId}`);
    return true;
  } catch (error) {
    console.error(
      `Failed to delete chat [DELETE /chat/${chatId}]:`,
      error.response?.data?.message || error.message,
    );
    return false;
  }
};

export default deleteChat;
