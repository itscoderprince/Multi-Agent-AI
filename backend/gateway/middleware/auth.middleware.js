import redis from "../../shared/redis/redis.js";
import { sendError } from "../../shared/utils/response.js";

export const checkAuth = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
      return sendError(res, "Unauthorized: No active session found", 401);
    }

    const sessionData = await redis.get(`session-${sessionId}`);
    if (!sessionData) {
      return sendError(res, "Unauthorized: Session expired or invalid", 401);
    }

    const user = JSON.parse(sessionData);
    req.user = user;

    // Forward user context to downstream microservices
    if (user.userId) {
      req.headers["x-user-id"] = user.userId;
    }
    if (user.email) {
      req.headers["x-user-email"] = user.email;
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return sendError(res, "Authentication error", 500, error);
  }
};