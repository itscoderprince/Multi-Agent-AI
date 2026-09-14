import Chat from "../models/chat.model.js";
import {
  sendSuccess,
  asyncHandler,
  AppError,
} from "../../../shared/utils/response.js";
import Message from "../models/message.model.js";

/**
 * Creates a new chat thread for the authenticated user
 * User ID is provided by the Gateway via 'x-user-id' header
 */
export const createChat = asyncHandler(async (req, res) => {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    throw new AppError(
      "Unauthorized: User ID not found in request headers",
      401,
    );
  }

  const { title } = req.body;

  const chat = await Chat.create({
    userId,
    title: title || "New Chat",
  });

  return sendSuccess(res, chat, "Chat created successfully 💬", 201);
});

/**
 * Retrieves all chats for the authenticated user
 */
export const getChats = asyncHandler(async (req, res) => {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    throw new AppError(
      "Unauthorized: User ID not found in request headers",
      401,
    );
  }

  const chats = await Chat.find({ userId }).sort({ updatedAt: -1 }).lean();

  return sendSuccess(res, chats, "Chats retrieved successfully 💬");
});

/**
 * Retrieves a single conversation by ID
 */
export const getChatById = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const userId = req.headers["x-user-id"];

  if (!chatId) {
    throw new AppError("Chat ID is required", 400);
  }

  const chat = await Chat.findById(chatId).lean();
  if (!chat) {
    throw new AppError("Chat not found", 404);
  }

  if (userId && chat.userId.toString() !== userId.toString()) {
    throw new AppError("Forbidden: You cannot access this conversation", 403);
  }

  return sendSuccess(res, chat, "Conversation retrieved successfully 💬");
});

/**
 * Saves a message (user or assistant) to a chat and updates the chat's lastMessage
 */
export const saveChat = asyncHandler(async (req, res) => {
  const {
    chat,
    chatId,
    conversationId,
    role = "user",
    content,
    images = [],
    artifact = null,
    uiFiles = [],
  } = req.body;
  const targetChatId = chatId || chat || conversationId || req.params.chatId;

  if (!targetChatId) {
    throw new AppError("Chat ID is required", 400);
  }

  if (!content || !content.trim()) {
    throw new AppError("Message content is required", 400);
  }

  const userId = req.headers["x-user-id"];
  const senderId = role === "assistant" ? "assistant" : (userId || "user");

  // Verify chat exists and update lastMessage atomically (single DB operation)
  const existingChat = await Chat.findByIdAndUpdate(
    targetChatId,
    { lastMessage: content.trim() },
    { returnDocument: "after" }
  ).lean();
  if (!existingChat) {
    throw new AppError("Chat not found", 404);
  }

  // Normalize artifact if uiFiles are passed without artifact
  let resolvedArtifact = artifact;
  const resolvedFiles = Array.isArray(uiFiles) && uiFiles.length > 0
    ? uiFiles
    : Array.isArray(artifact?.files)
    ? artifact.files
    : [];

  if (!resolvedArtifact && resolvedFiles.length > 0) {
    resolvedArtifact = {
      id: Date.now(),
      type: "application/code",
      files: resolvedFiles,
    };
  }

  // Create message
  const message = await Message.create({
    chatId: targetChatId,
    conversationId: targetChatId,
    senderId,
    role,
    content: content.trim(),
    images: Array.isArray(images) ? images : [],
    artifact: resolvedArtifact,
    uiFiles: resolvedFiles,
  });

  return sendSuccess(res, message, "Message saved successfully 💬", 201);
});

/**
 * Retrieves all messages for a specific chat
 */
export const getMessages = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId || req.query.chatId;

  if (!chatId) {
    throw new AppError("Chat ID is required", 400);
  }

  const messages = await Message.find({ chatId }).sort({ createdAt: 1 }).lean();

  return sendSuccess(res, messages, "Messages retrieved successfully 💬");
});

/**
 * Updates a chat/conversation (e.g. rename title)
 */
export const updateChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { title } = req.body;
  const userId = req.headers["x-user-id"];

  if (!chatId) {
    throw new AppError("Chat ID is required", 400);
  }

  if (!title || !title.trim()) {
    throw new AppError("Chat title is required", 400);
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new AppError("Chat not found", 404);
  }

  // Ensure user owns this conversation
  if (userId && chat.userId.toString() !== userId.toString()) {
    throw new AppError("Forbidden: You cannot modify this conversation", 403);
  }

  chat.title = title.trim();
  await chat.save();

  return sendSuccess(res, chat, "Conversation updated successfully 💬");
});

/**
 * Deletes a chat/conversation and all its messages
 */
export const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const userId = req.headers["x-user-id"];

  if (!chatId) {
    throw new AppError("Chat ID is required", 400);
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new AppError("Chat not found", 404);
  }

  // Ensure user owns this conversation
  if (userId && chat.userId.toString() !== userId.toString()) {
    throw new AppError("Forbidden: You cannot delete this conversation", 403);
  }

  await Chat.findByIdAndDelete(chatId);
  await Message.deleteMany({ chatId });

  return sendSuccess(res, null, "Conversation deleted successfully 🗑️");
});
