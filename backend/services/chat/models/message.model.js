import mongoose from "mongoose";

export const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

export const artifactSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.Mixed,
    },
    type: {
      type: String,
      default: "application/code",
    },
    files: {
      type: [fileSchema],
      default: [],
    },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: function () {
        return this.chatId;
      },
    },
    senderId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      default: "user",
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    artifact: {
      type: artifactSchema,
      default: null,
    },
    uiFiles: {
      type: [fileSchema],
      default: [],
    },
  },
  { timestamps: true, collection: "messages" }
);

// Compound index for ultra-fast chat message retrieval sorted by timestamp
messageSchema.index({ chatId: 1, createdAt: 1 });

// Keep conversationId synced with chatId for backward/forward compatibility
messageSchema.pre("save", function () {
  if (!this.conversationId && this.chatId) {
    this.conversationId = this.chatId;
  }
  if (!this.chatId && this.conversationId) {
    this.chatId = this.conversationId;
  }
});

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema, "messages");

export default Message;
