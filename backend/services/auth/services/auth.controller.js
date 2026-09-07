import crypto from "node:crypto";
import { getAuth } from "firebase-admin/auth";
import firebaseApp from "../config/firebase.js";
import User from "../models/auth.model.js";

export const login = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const decoded = await getAuth(firebaseApp).verifyIdToken(token);
    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name || "",
        email: decoded.email,
        avatar: decoded.picture || "",
      });
    }

    const sessionId = crypto.randomUUID();
    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(401).json({
      message: "Authentication failed",
      error: error.message,
    });
  }
};

