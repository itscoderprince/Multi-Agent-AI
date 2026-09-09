import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { GoogleIcon } from "@/components/icons/GoogleIcon";

/**
 * LoginCard component rendering the Google authentication and demo login options.
 */
export function LoginCard({ onLogin, onDemoLogin, loading, error }) {
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
          type="button"
          variant="outline"
          onClick={onLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 h-10 cursor-pointer"
        >
          <GoogleIcon className="w-4 h-4" />
          <span>{loading ? "Signing in..." : "Continue with Google"}</span>
        </Button>
        {onDemoLogin && (
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onDemoLogin}
              className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors cursor-pointer"
            >
              Explore Demo Workspace
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LoginCard;
