import express from "express";
import {
  createChat,
  getChats,
  updateChat,
  deleteChat,
  saveChat,
  getMessages,
} from "../controllers/chat.controller.js";

const router = express.Router();

// Conversation / Chat thread routes (require x-user-id from Gateway)
router.post("/", createChat);
router.get("/", getChats);
router.put("/:chatId", updateChat);
router.delete("/:chatId", deleteChat);

// Message routes
router.post("/:chatId/messages", saveChat);
router.get("/:chatId/messages", getMessages);

// Test route
router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Chat route is working 💬🚀",
    userId: req.headers["x-user-id"] || null,
    userEmail: req.headers["x-user-email"] || null,
  });
});

export default router;
