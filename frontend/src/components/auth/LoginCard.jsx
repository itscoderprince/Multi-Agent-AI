import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleIcon } from "@/components/icons/GoogleIcon";

export function LoginCard({ onLogin, loading, error }) {
  return (
    <Card className="w-full max-w-sm shadow-md">
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
          onClick={onLogin}
          disabled={loading}
          variant="outline"
          className="w-full flex items-center justify-center gap-2.5 h-10 font-medium hover:bg-muted transition-colors cursor-pointer"
        >
          <GoogleIcon className="w-4 h-4" />
          <span>{loading ? "Signing in..." : "Continue with Google"}</span>
        </Button>
      </CardContent>
    </Card>
  );
}

export default LoginCard;
