import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant",],
      default: "user",
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "messages" }
);

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema, "messages");

export default Message;
