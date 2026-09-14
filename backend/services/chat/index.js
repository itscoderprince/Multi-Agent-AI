import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./configs/db.js";
import chatRoutes from "./routes/chat.route.js";
import {
  errorHandler,
  notFound,
} from "../../shared/middleware/error.middleware.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// Chat service health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "chat-service",
    message: "Chat Service is up and running 💬🚀",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Mount Chat routes (supports '/', '/chat', and '/chats')
app.use("/chat", chatRoutes);
app.use("/chats", chatRoutes);
app.use("/", chatRoutes);

// 404 & Global Error Handling
app.use(notFound);
app.use(errorHandler);

// Start server immediately so Gateway never gets 504 on restarts/startup
app.listen(PORT, () => {
  console.log(
    `\n💬 [CHAT SERVICE] 🚀 Chat server is running on port: ${PORT} ✨`,
  );
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔑 Health: http://localhost:${PORT}/health\n`);
});

// Connect to MongoDB Atlas (Mongoose automatically buffers queries until connected)
connectDB();
