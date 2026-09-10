import express from "express";
import {
  createChat,
  getChats,
  getChatById,
  updateChat,
  deleteChat,
  saveChat,
  getMessages,
} from "../controllers/chat.controller.js";

const router = express.Router();

/* ==========================================================================
   1. CONVERSATION COLLECTION ROUTES
   Path: / (Gateway: /chat or /chats)
   ========================================================================== */

/**
 * @route   GET / (Gateway: GET /chat)
 * @desc    Retrieve all chat conversations for the authenticated user
 * @access  Private (Requires 'x-user-id' injected by Gateway)
 * @return  {Array<Chat>} 200 - List of user chat threads sorted by updatedAt DESC
 */
/**
 * @route   POST / (Gateway: POST /chat)
 * @desc    Create a new chat conversation thread
 * @access  Private (Requires 'x-user-id' injected by Gateway)
 * @body    {string} [title="New Chat"] - Optional custom conversation title
 * @return  {Chat} 201 - Newly created chat document
 */
router
  .route("/")
  .get(getChats)
  .post(createChat);

/* ==========================================================================
   2. SYSTEM / HEALTH DIAGNOSTICS ROUTE
   Path: /test (Must precede /:chatId to avoid being captured as a parameter)
   ========================================================================== */

/**
 * @route   GET /test (Gateway: GET /chat/test)
 * @desc    Test route to verify chat service routing and gateway header injection
 * @access  Public / Diagnostic
 */
router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Chat route is working 💬🚀",
    userId: req.headers["x-user-id"] || null,
    userEmail: req.headers["x-user-email"] || null,
  });
});

/* ==========================================================================
   3. INDIVIDUAL CONVERSATION RESOURCE ROUTES
   Path: /:chatId (Gateway: /chat/:chatId or /chats/:chatId)
   ========================================================================== */

/**
 * @route   GET /:chatId (Gateway: GET /chat/:chatId)
 * @desc    Retrieve a single chat conversation by ID
 * @access  Private (Owner only)
 * @param   {string} chatId - Conversation ObjectID
 * @return  {Chat} 200 - Chat document
 */
/**
 * @route   PUT /:chatId (Gateway: PUT /chat/:chatId)
 * @desc    Update conversation details (e.g. rename title)
 * @access  Private (Owner only)
 * @param   {string} chatId - Conversation ObjectID
 * @body    {string} title - Updated title
 * @return  {Chat} 200 - Updated chat document
 */
/**
 * @route   DELETE /:chatId (Gateway: DELETE /chat/:chatId)
 * @desc    Permanently delete a conversation and all its associated messages
 * @access  Private (Owner only)
 * @param   {string} chatId - Conversation ObjectID
 * @return  {null} 200 - Deletion confirmation
 */
router
  .route("/:chatId")
  .get(getChatById)
  .put(updateChat)
  .delete(deleteChat);

/* ==========================================================================
   3. MESSAGE SUB-RESOURCE ROUTES
   Path: /:chatId/messages (Gateway: /chat/:chatId/messages)
   ========================================================================== */

/**
 * @route   GET /:chatId/messages (Gateway: GET /chat/:chatId/messages)
 * @desc    Retrieve full message history for a specific conversation
 * @access  Private
 * @param   {string} chatId - Conversation ObjectID
 * @return  {Array<Message>} 200 - List of messages sorted by createdAt ASC
 */
/**
 * @route   POST /:chatId/messages (Gateway: POST /chat/:chatId/messages)
 * @desc    Save/send a new message (user prompt or AI response) to the conversation
 * @access  Private
 * @param   {string} chatId - Conversation ObjectID
 * @body    {string} content - Message text content (required)
 * @body    {string} [role="user"] - Sender role ("user" | "assistant")
 * @return  {Message} 201 - Saved message document
 */
router
  .route("/:chatId/messages")
  .get(getMessages)
  .post(saveChat);

export default router;
