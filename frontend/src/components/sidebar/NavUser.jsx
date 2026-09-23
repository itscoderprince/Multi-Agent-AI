import { memo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, Settings, Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUserData } from "@/redux/slices/userSlice";
import api from "@/utils/axios";

/**
 * Extracts up to 2 uppercase initials from a name (e.g. "prince sharma" -> "PS")
 */
const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const NavUser = ({ user, collapsed }) => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      dispatch(setUserData(null));
    }
  };

  if (!user) return null;

  const menuContent = (
    <DropdownMenuContent
      side={collapsed ? "right" : "top"}
      align={collapsed ? "end" : "start"}
      sideOffset={14}
      className="w-56 bg-[#131720] border border-white/10 text-slate-200 shadow-xl rounded-xl p-1"
    >
      <div className="flex items-center gap-2.5 p-2">
        <Avatar className="size-8 shrink-0">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-[#2a3444] text-slate-200 text-xs font-semibold">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-semibold text-slate-100 truncate" title={user.name}>
            {user.name || "User"}
          </span>
          <span className="text-xs text-slate-400 truncate">
            {user.email || ""}
          </span>
        </div>
      </div>

      <DropdownMenuSeparator className="bg-white/10 my-1" />

      <DropdownMenuGroup>
        <DropdownMenuItem className="cursor-pointer gap-2 py-2 px-2.5 rounded-lg hover:bg-white/5 text-xs text-slate-200">
          <Sparkles className="size-4 text-emerald-400" />
          Upgrade Plan
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2 py-2 px-2.5 rounded-lg hover:bg-white/5 text-xs text-slate-200">
          <Settings className="size-4 text-slate-400" />
          Settings
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator className="bg-white/10 my-1" />

      <DropdownMenuItem
        onClick={handleLogout}
        variant="destructive"
        className="cursor-pointer gap-2 py-2 px-2.5 rounded-lg hover:bg-rose-500/10 text-xs text-rose-400"
      >
        <LogOut className="size-4" />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  if (collapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full flex justify-center p-1 rounded-xl hover:bg-white/5 cursor-pointer outline-none">
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-[#2a3444] text-slate-200 text-xs font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        {menuContent}
      </DropdownMenu>
    );
  }

  return (
    <div className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-2xl bg-[#161920] border border-white/6 hover:bg-[#1c2029] transition-colors">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2.5 flex-1 min-w-0 text-left cursor-pointer outline-none group">
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-[#2a3444] text-slate-200 text-xs font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-start min-w-0 flex-1 gap-0.5">
            <span
              className="text-sm font-medium text-slate-100 truncate group-hover:text-white"
              title={user.name}
            >
              {user.name || "User"}
            </span>
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4 font-normal"
            >
              Free
            </Badge>
          </div>
        </DropdownMenuTrigger>

        {menuContent}
      </DropdownMenu>

      <button
        type="button"
        className="rounded-full border border-white/15 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
      >
        Upgrade
      </button>
    </div>
  );
};

export default memo(NavUser);
