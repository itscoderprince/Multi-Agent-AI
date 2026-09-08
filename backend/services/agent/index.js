import express from "express";
import dotenv from "dotenv";
import {
  errorHandler,
  notFound,
} from "../../shared/middleware/error.middleware.js";
import agentRoute from "./routes/agent.route.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Health check
app.get(["/", "/health"], (req, res) => {
  res.status(200).json({
    success: true,
    service: "agent-service",
    message: "Agent Service is up and running 🤖🚀",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Mount Agent Routes
app.use("/", agentRoute);

// 404 & Global Error Handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🤖 [AGENT SERVICE] 🚀 Server is running on port: ${PORT} ✨`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔑 Health: http://localhost:${PORT}/health\n`);
});