import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";
import api from "@/utils/axios";
import { setUserData } from "@/redux/slices/userSlice";
import LoginCard from "@/components/auth/LoginCard";
import ChatPage from "@/components/chat/ChatPage";

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Authenticate with Firebase Client
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      // 2. Authenticate with Backend via Gateway
      const response = await api.post("/auth/login", { token });
      const userData = response.data?.data || response.data?.user || response.data;
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

  const handleDemoLogin = () => {
    dispatch(
      setUserData({
        userId: "demo-user-1",
        name: "Demo User",
        email: "developer@multiagent.ai",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=DemoUser",
      })
    );
  };

  const handleLogout = async () => {
    try {
      // 1. Clear backend session in Redis & Cookie
      await api.post("/auth/logout").catch(() => {});

      // 2. Sign out of Firebase client
      await signOut(auth).catch(() => {});
      dispatch(setUserData(null));
    } catch (err) {
      console.error("Logout error:", err);
      dispatch(setUserData(null));
    }
  };

  if (user) {
    return <ChatPage user={user} onLogout={handleLogout} />;
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
