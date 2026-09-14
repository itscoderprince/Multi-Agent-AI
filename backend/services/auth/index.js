import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.route.js";
import { errorHandler, notFound } from "../../shared/middleware/error.middleware.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 2000;

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Auth service health check
app.get(["/", "/health"], (req, res) => {
  res.status(200).json({
    success: true,
    service: "auth-service",
    message: "Authentication Service is up and secure 🔐🛡️",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Mount Auth routes
app.use("/", authRoutes);
app.use("/auth", authRoutes);

// 404 & Global Error Handling
app.use(notFound);
app.use(errorHandler);

// Start server immediately so Gateway never gets 504 on restarts/startup
app.listen(PORT, () => {
  console.log(
    `\n🔐 [AUTH SERVICE] 🛡️  Auth server is running on port: ${PORT} 🚀`,
  );
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔑 Health: http://localhost:${PORT}/health\n`);
});

// Connect to MongoDB Atlas (Mongoose automatically buffers any queries until connected)
connectDB();
