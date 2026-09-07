import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UserProfileCard({ user, onLogout }) {
  return (
    <Card className="w-full max-w-sm shadow-md">
      <CardHeader className="text-center">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name || "User avatar"}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-primary/20 object-cover shadow-sm"
          />
        ) : (
          <div className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-primary/20 bg-primary/10 flex items-center justify-center font-bold text-xl text-primary">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
        <CardTitle className="text-xl font-semibold">
          {user.name || "User"}
        </CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg bg-muted text-xs space-y-1">
          <p>
            <span className="font-semibold">User ID:</span> {user._id || user.id || user.userId}
          </p>
          <p className="text-emerald-600 font-medium">
            MongoDB Connected & Session Active ✅
          </p>
        </div>
        <Button
          onClick={onLogout}
          variant="destructive"
          className="w-full cursor-pointer"
        >
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserProfileCard;
