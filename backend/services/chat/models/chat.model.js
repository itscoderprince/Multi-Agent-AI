import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "New Chat",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, collection: "chats" }
);

// Compound index for fast user conversations lookup sorted by last activity
chatSchema.index({ userId: 1, updatedAt: -1 });

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema, "chats");

export default Chat;
