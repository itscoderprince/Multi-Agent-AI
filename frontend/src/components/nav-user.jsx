import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, LogOutIcon, UserIcon } from "lucide-react"

export function NavUser({
  user,
  onLogout,
}) {
  const { isMobile } = useSidebar()

  const name = user?.displayName || user?.name || "Anonymous User"
  const email = user?.email || "user@multiagent.ai"
  const avatarUrl = user?.photoURL || user?.avatar || ""
  const initials =
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="aria-expanded:bg-muted cursor-pointer"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-lg border border-border/50 shrink-0">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-xs leading-tight min-w-0 group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold text-foreground">{name}</span>
              <span className="truncate text-[11px] text-muted-foreground">{email}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground/60 shrink-0 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2.5 px-2 py-2 text-left">
                  <Avatar className="h-8 w-8 rounded-lg border border-border/50 shrink-0">
                    <AvatarImage src={avatarUrl} alt={name} />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
                    <span className="truncate font-semibold text-foreground">{name}</span>
                    <span className="truncate text-[11px] text-muted-foreground">{email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                <UserIcon className="size-3.5" />
                Profile settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOutIcon className="size-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
