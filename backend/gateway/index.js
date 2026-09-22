import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import proxy from "express-http-proxy";
import { checkAuth } from "./middleware/auth.middleware.js";
import {
  errorHandler,
  notFound,
} from "../shared/middleware/error.middleware.js";
import { sendSuccess } from "../shared/utils/response.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 1000;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.includes("localhost") || origin.includes("vercel.app") || (process.env.CLIENT_URL && origin.startsWith(process.env.CLIENT_URL))) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(morgan("dev"));

// Proxy to Auth Service (parseReqBody: false pipes the raw stream and prevents Node 20+ header errors)
app.use(
  "/auth",
  proxy(process.env.AUTH_SERVICE || "http://localhost:2000", {
    parseReqBody: false,
    timeout: 10000,
    proxyErrorHandler: async (err, res, next) => {
      console.warn(`[Gateway ⚠️ Auth Proxy]: ${err.message}`);
      // On ECONNRESET the auth service is restarting — wait for it to come back before responding
      // so the browser's immediate retry lands on a live service
      if (err.code === "ECONNRESET" || err.code === "ECONNREFUSED") {
        await new Promise((r) => setTimeout(r, 1500));
      }
      return res.status(503).json({
        success: false,
        message: "Auth service restarted. Retrying automatically…",
      });
    },
  }),
);

// Proxy to Chat Service (supports /chat and /chats, protected by checkAuth)
app.use(
  ["/chat", "/chats"],
  checkAuth,
  proxy(process.env.CHAT_SERVICE || "http://localhost:3000", {
    timeout: 15000,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["x-user-id"] = srcReq.user?.userId || "";
      proxyReqOpts.headers["x-user-email"] = srcReq.user?.email || "";
      return proxyReqOpts;
    },
    proxyErrorHandler: (err, res, next) => {
      console.warn(`[Gateway ⚠️ Chat Proxy Error]:`, err.message);
      return res.status(503).json({
        success: false,
        message: "Chat service temporarily unavailable. Please try again.",
      });
    },
  }),
);

// Proxy to Agent Service (protected by checkAuth: injects x-user-id and x-user-email headers)
app.use(
  "/agent",
  checkAuth,
  proxy(process.env.AGENT_SERVICE || "http://localhost:4000", {
    timeout: 60000,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["x-user-id"] = srcReq.user?.userId || "";
      proxyReqOpts.headers["x-user-email"] = srcReq.user?.email || "";
      return proxyReqOpts;
    },
    proxyErrorHandler: (err, res, next) => {
      console.warn(`[Gateway ⚠️ Agent Proxy Error]:`, err.message);
      return res.status(503).json({
        success: false,
        message: "Agent service temporarily unavailable. Please try again.",
      });
    },
  }),
);

app.use(express.json());

// Health check
app.get(["/", "/health"], (req, res) =>
  res.json({ status: "ok", service: "gateway" }),
);

// Example Protected Route: checks Redis session cookie before allowing access
app.get("/me", checkAuth, (req, res) => {
  return sendSuccess(res, req.user, "You accessed a protected route! 🛡️");
});

// 404 & Global Error Handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `\n🚪 [API GATEWAY] 🌐 Gateway server is running on port: ${PORT} 🚀`,
  );
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🛡️  Health: http://localhost:${PORT}/health\n`);
});
