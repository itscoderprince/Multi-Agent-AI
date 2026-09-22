import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyPath = path.resolve(__dirname, "../serviceAccountKey.json");

let credentialOption = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    credentialOption = cert(parsed);
  } catch (err) {
    console.warn("[Firebase] Warning: Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", err.message);
  }
}

if (!credentialOption && fs.existsSync(keyPath)) {
  try {
    const raw = fs.readFileSync(keyPath, "utf8");
    const parsed = JSON.parse(raw);
    credentialOption = cert(parsed);
  } catch (err) {
    console.warn("[Firebase] Warning: Failed to parse serviceAccountKey.json:", err.message);
  }
}

export const firebaseApp =
  getApps().length === 0
    ? initializeApp(
        credentialOption
          ? { credential: credentialOption }
          : { projectId: process.env.FIREBASE_PROJECT_ID || "multi-agent-ai-d08b2" }
      )
    : getApp();

export const firebaseAuth = getAuth(firebaseApp);

export default firebaseApp;
