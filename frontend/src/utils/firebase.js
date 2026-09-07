// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "multi-agent-ai-d08b2.firebaseapp.com",
  projectId: "multi-agent-ai-d08b2",
  storageBucket: "multi-agent-ai-d08b2.firebasestorage.app",
  messagingSenderId: "796466281759",
  appId: "1:796466281759:web:359ac4c3ad5cd8e553442a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export default app;
