import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
  MessageSquareIcon,
  MoreHorizontalIcon,
  Trash2Icon,
  Share2Icon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
  ChevronsUpDownIcon,
  Code2Icon,
  SearchIcon,
  FileTextIcon,
  PanelLeftIcon,
  MessageCirclePlusIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"

import { PeacockFeatherIcon } from "@/components/icons/PeacockFeatherIcon"

export function AppSidebar({
  user,
  chats = [],
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onLogout,
  ...props
}) {
  const { isMobile, toggleSidebar } = useSidebar()
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredChats = searchQuery.trim()
    ? chats.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
    : chats

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Workspace Header & Toggle & New Chat matching Image 1 */}
      <SidebarHeader className="gap-3 p-3 pb-1">
        {/* Top Header Row: [Logo] [sarthiAi] ... [Search] [PanelLeft] */}
        <div className="flex items-center justify-between w-full px-0.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <PeacockFeatherIcon className="size-7.5 shrink-0" />
            <span className="font-bold text-xl tracking-tight text-[#4D6BFE] dark:text-[#4D6BFE]">
              sarthi<span className="font-extrabold text-[#3B82F6]">Ai</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="size-7 rounded-lg text-neutral-400 hover:text-foreground cursor-pointer"
              title="Search chats"
            >
              <SearchIcon className="size-4.5" />
              <span className="sr-only">Search chats</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="size-7 rounded-lg text-neutral-400 hover:text-foreground cursor-pointer"
              title="Close sidebar"
            >
              <PanelLeftIcon className="size-4.5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>
        </div>

        {/* Optional Search Bar when Search is toggled */}
        {isSearchOpen && (
          <div className="relative animate-in fade-in-0 duration-150">
            <SearchIcon className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="h-8 pl-8 text-xs bg-muted/50 rounded-lg"
              autoFocus
            />
          </div>
        )}

        {/* "New chat" Button matching Image 1: Rounded pill with MessageCirclePlus */}
        <button
          type="button"
          onClick={onNewChat}
          className="w-full h-10 rounded-full bg-[#2f2f32] hover:bg-[#38383c] text-neutral-100 flex items-center justify-center gap-2.5 px-4 text-sm font-medium transition-colors cursor-pointer shadow-xs active:scale-[0.99] mt-0.5"
        >
          <MessageCirclePlusIcon className="size-4.5 text-neutral-300" />
          <span>New chat</span>
        </button>
      </SidebarHeader>

      {/* Navigation & Chat History */}
      <SidebarContent>
        {/* Recent Chats */}
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarMenu>
            {filteredChats.length === 0 ? (
              <div className="px-2.5 py-2 text-xs text-muted-foreground">
                {searchQuery ? "No matching chats" : "No recent chats"}
              </div>
            ) : (
              filteredChats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    isActive={chat.id === activeChatId}
                    onClick={() => onSelectChat?.(chat.id)}
                    tooltip={chat.title}
                    className="gap-3 px-3 pr-9"
                  >
                    <MessageSquareIcon className="size-4 shrink-0 text-neutral-400" />
                    <span className="truncate">{chat.title}</span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <SidebarMenuAction
                          showOnHover
                          className="right-3 aria-expanded:bg-muted"
                        />
                      }
                    >
                      <MoreHorizontalIcon className="size-4" />
                      <span className="sr-only">Options</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-44"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Share2Icon className="size-4" />
                        <span>Share Conversation</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => onDeleteChat?.(chat.id)}
                      >
                        <Trash2Icon className="size-4" />
                        <span>Delete Chat</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>

        {/* Quick Agent Modes */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Agent Suites</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="gap-3 px-3">
                <Code2Icon className="size-4 text-neutral-400" />
                <span>Code Studio</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="gap-3 px-3">
                <SearchIcon className="size-4 text-neutral-400" />
                <span>Deep Research</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="gap-3 px-3">
                <FileTextIcon className="size-4 text-neutral-400" />
                <span>Document QA</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
                }
              >
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={user?.avatar || user?.photoURL} alt={user?.name || "User"} />
                  <AvatarFallback className="rounded-lg">
                    {(user?.name || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-medium">{user?.name || "User"}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </span>
                </div>
                <ChevronsUpDownIcon className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="size-8 rounded-lg">
                        <AvatarImage src={user?.avatar || user?.photoURL} alt={user?.name || "User"} />
                        <AvatarFallback className="rounded-lg">
                          {(user?.name || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{user?.name || "User"}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {user?.email || "user@example.com"}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <UserIcon className="size-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <SettingsIcon className="size-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                  onClick={onLogout}
                >
                  <LogOutIcon className="size-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
