import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";

export default function UserProfileBar({ user, onLogout }) {
  const name = user?.displayName || user?.name || "Anonymous User";
  const email = user?.email || "user@multiagent.ai";
  const avatarUrl = user?.photoURL || user?.avatar || "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return (
    <div className="p-3 border-t border-border/60 bg-muted/20">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-12 px-2.5 rounded-xl hover:bg-accent/70 transition-all text-left"
          >
            <Avatar className="h-8 w-8 rounded-lg border border-border/50">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold truncate leading-tight">{name}</span>
              <span className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                {email}
              </span>
            </div>
            <Settings className="h-4 w-4 text-muted-foreground/60 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="w-56 mb-2">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-xs font-medium leading-none">{name}</p>
              <p className="text-[11px] leading-none text-muted-foreground">{email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
            <User className="h-3.5 w-3.5" />
            Profile settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onLogout}
            className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
