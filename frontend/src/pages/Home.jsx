import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";
import api from "@/utils/axios";
import { setUserData } from "@/redux/slices/userSlice";
import LoginCard from "@/components/auth/LoginCard";
import UserProfileCard from "@/components/auth/UserProfileCard";

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

  const handleLogout = async () => {
    try {
      // 1. Clear backend session in Redis & Cookie
      await api.post("/auth/logout").catch(() => {});

      // 2. Sign out of Firebase client
      await signOut(auth);
      dispatch(setUserData(null));
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      {user ? (
        <UserProfileCard user={user} onLogout={handleLogout} />
      ) : (
        <LoginCard
          onLogin={handleGoogleLogin}
          loading={loading}
          error={error}
        />
      )}
    </main>
  );
}
