import crypto from "node:crypto";
import { getAuth } from "firebase-admin/auth";
import firebaseApp from "../config/firebase.js";
import User from "../models/auth.model.js";
import redis from "../../../shared/redis/redis.js";
import { sendSuccess, asyncHandler, AppError } from "../../../shared/utils/response.js";

export const login = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    throw new AppError("Token is required", 400);
  }

  const decoded = await getAuth(firebaseApp).verifyIdToken(token);
  let user = await User.findOne({ firebaseUid: decoded.uid });

  if (!user) {
    user = await User.create({
      firebaseUid: decoded.uid,
      name: decoded.name || "",
      email: decoded.email,
      avatar: decoded.picture || "",
    });
  }

  const sessionId = crypto.randomUUID();
  await redis.set(
    `session-${sessionId}`,
    JSON.stringify({
      userId: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    }),
    "EX",
    7 * 24 * 60 * 60
  );

  res.cookie("session", sessionId, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendSuccess(res, user, "Logged in successfully ✅");
});

export const logout = asyncHandler(async (req, res) => {
  const sessionId = req.cookies?.session;

  if (sessionId) {
    await redis.del(`session-${sessionId}`);
  }

  res.clearCookie("session", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  return sendSuccess(res, null, "Logged out successfully ✅");
});