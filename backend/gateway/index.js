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
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(morgan("dev"));

// Proxy to Auth Service (parseReqBody: false pipes the raw stream and prevents Node 20+ header errors)
app.use(
  "/auth",
  proxy(process.env.AUTH_SERVICE, {
    parseReqBody: false,
  }),
);

// Proxy to Chat Service (protected by checkAuth: injects x-user-id and x-user-email headers)
app.use(
  "/chat",
  checkAuth,
  proxy(process.env.CHAT_SERVICE || "http://localhost:3000", {
    parseReqBody: false,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["x-user-id"] = srcReq.user?.userId || "";
      proxyReqOpts.headers["x-user-email"] = srcReq.user?.email || "";
      return proxyReqOpts;
    },
  }),
);

// Proxy to Agent Service (protected by checkAuth: injects x-user-id and x-user-email headers)
app.use(
  "/agent",
  checkAuth,
  proxy(process.env.AGENT_SERVICE || "http://localhost:4000", {
    parseReqBody: false,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["x-user-id"] = srcReq.user?.userId || "";
      proxyReqOpts.headers["x-user-email"] = srcReq.user?.email || "";
      return proxyReqOpts;
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
