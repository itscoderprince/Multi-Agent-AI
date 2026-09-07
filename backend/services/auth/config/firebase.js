import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "../serviceAccountKey.json" with { type: "json" };

// Prevent multiple initialization during hot reloads (node --watch)
export const firebaseApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApp();

export const firebaseAuth = getAuth(firebaseApp);

export default firebaseApp;

