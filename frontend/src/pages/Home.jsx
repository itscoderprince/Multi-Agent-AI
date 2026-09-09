import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";
import api from "@/utils/axios";
import { setUserData } from "@/redux/slices/userSlice";
import LoginCard from "@/components/auth/LoginCard";
import Sidebar from "@/components/sidebar/Sidebar";
import ChatArea from "@/components/chat/Chat";
import Artifact from "@/components/artifact/Artifact";

/**
 * Main landing page rendering the centered login card or the chat workspace when authenticated.
 */
export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Authenticates with Firebase via Google popup, then exchanges the token with backend gateway.
   */
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Authenticate with Firebase Client
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      // 2. Authenticate with Backend via Gateway
      const response = await api.post("/auth/login", { token });
      const userData =
        response.data?.data || response.data?.user || response.data;
      dispatch(setUserData(userData));
    } catch (err) {
      console.error("Login error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError(
          err.response?.data?.message || err.message || "Failed to sign in",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Dispatches mock demo credentials to explore the application without signing in.
   */
  const handleDemoLogin = () => {
    dispatch(
      setUserData({
        userId: "demo-user-1",
        name: "Demo User",
        email: "developer@multiagent.ai",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=DemoUser",
      }),
    );
  };

  if (user) {
    return (
      <main className="h-screen w-screen flex bg-[#0d0f14] text-white overflow-hidden">
        <Sidebar />
        <ChatArea />
        <Artifact />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <LoginCard
        onLogin={handleGoogleLogin}
        onDemoLogin={handleDemoLogin}
        loading={loading}
        error={error}
      />
    </main>
  );
}
