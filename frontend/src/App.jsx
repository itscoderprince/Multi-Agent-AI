import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";
import api from "@/utils/axios";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (token) => {
    try {
      const response = await api.post("/auth/login", { token });
      console.log("Backend user created/found:", response.data);
      setUser(response.data);
    } catch (err) {
      console.error("Backend login error:", err);
      setError(
        err.response?.data?.message || "Failed to authenticate with backend server"
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await handleLogin(token);
    } catch (err) {
      console.error("Google sign-in error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Failed to sign in with Google");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-sm shadow-md">
        {user ? (
          <>
            <CardHeader className="text-center">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-primary/20 object-cover"
                />
              )}
              <CardTitle className="text-xl font-semibold">
                {user.name || "User"}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-muted text-xs space-y-1">
                <p>
                  <span className="font-semibold">User ID:</span> {user._id || user.id}
                </p>
                <p className="text-emerald-600 font-medium">
                  MongoDB Connected & Cookie Set ✅
                </p>
              </div>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full cursor-pointer"
              >
                Sign Out
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-semibold">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to continue to Multi-Agent AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {error && (
                <div className="p-2.5 text-xs rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                  {error}
                </div>
              )}
              <Button
                onClick={handleGoogleLogin}
                disabled={loading}
                variant="outline"
                className="w-full flex items-center justify-center gap-2.5 h-10 font-medium hover:bg-muted transition-colors cursor-pointer"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>{loading ? "Signing in..." : "Continue with Google"}</span>
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </main>
  );
}

export default App;

