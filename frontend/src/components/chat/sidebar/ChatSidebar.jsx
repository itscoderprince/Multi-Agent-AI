import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NavUser } from "@/components/nav-user";
import ThemeToggle from "@/components/theme/ThemeToggle";
import {
  Bot,
  Plus,
  MessageSquare,
  MoreHorizontal,
  Edit2,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatSidebar({
  chats = [],
  activeChatId,
  onSelectChat,
  onNewChat,
  onRenameChat,
  onDeleteChat,
  user,
  onLogout,
  className,
}) {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className={cn("border-r border-sidebar-border/60 select-none", className)}>
      {/* 1. Header: Branding & New Chat */}
      <SidebarHeader className="border-b border-sidebar-border/40 p-2">
        <SidebarMenu className="gap-1.5 group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            {isCollapsed ? (
              /* Collapsed State: ChatGPT-style robot icon that changes to toggle button on hover */
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      onClick={toggleSidebar}
                      aria-label="Open sidebar"
                      className="group/bot relative flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-sidebar-accent hover:text-foreground transition-all cursor-pointer shadow-2xs"
                    />
                  }
                >
                  <Bot className="size-4.5 transition-all duration-200 group-hover/bot:opacity-0 group-hover/bot:scale-75 shrink-0" />
                  <PanelLeftOpen className="size-4.5 absolute transition-all duration-200 opacity-0 scale-75 group-hover/bot:opacity-100 group-hover/bot:scale-100 text-foreground shrink-0" />
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  Open sidebar
                </TooltipContent>
              </Tooltip>
            ) : (
              /* Expanded State: Full branding + ThemeToggle + Collapse button */
              <div className="flex w-full items-center justify-between gap-2 px-1 py-0.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs shrink-0">
                    <Bot className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
                    <span className="truncate font-semibold text-foreground">Sarathi AI</span>
                    <span className="truncate text-[10px] text-muted-foreground">Multi-Agent</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                  <ThemeToggle />
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <button
                          onClick={toggleSidebar}
                          aria-label="Close sidebar"
                          className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors cursor-pointer"
                        />
                      }
                    >
                      <PanelLeftClose className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Close sidebar
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            )}
          </SidebarMenuItem>

          {/* New Chat Button */}
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      onClick={onNewChat}
                      aria-label="New chat"
                      className="flex size-8 items-center justify-center rounded-lg border border-dashed border-sidebar-border hover:border-primary/50 hover:bg-sidebar-accent text-primary transition-all cursor-pointer shadow-2xs"
                    />
                  }
                >
                  <Plus className="size-4 shrink-0" />
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  New chat
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                onClick={onNewChat}
                className="flex w-full items-center gap-2 h-9 px-2.5 rounded-lg border border-dashed border-sidebar-border hover:border-primary/50 hover:bg-sidebar-accent/70 text-foreground transition-all font-medium text-xs cursor-pointer shadow-2xs"
              >
                <div className="flex items-center justify-center size-4 text-primary shrink-0">
                  <Plus className="size-4" />
                </div>
                <span>New chat</span>
              </button>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* 2. Content: Conversation History */}
      <SidebarContent className="p-2 overflow-y-auto">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider px-1 group-data-[collapsible=icon]:hidden">
            Conversations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {chats.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground/60 group-data-[collapsible=icon]:hidden">
                No chat history yet
              </div>
            ) : (
              <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:items-center">
                {chats.map((chat) => {
                  const chatId = chat._id || chat.id;
                  const isActive = chatId === activeChatId;
                  const title = chat.title || "Untitled Chat";

                  return (
                    <SidebarMenuItem
                      key={chatId}
                      className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
                    >
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => onSelectChat?.(chatId)}
                        tooltip={title}
                        className={cn(
                          "h-8 text-xs font-medium rounded-lg px-2 transition-all cursor-pointer group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
                            : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                        )}
                      >
                        <MessageSquare
                          className={cn(
                            "size-3.5 shrink-0 transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground/70"
                          )}
                        />
                        <span className="truncate">{title}</span>
                      </SidebarMenuButton>

                      {(onRenameChat || onDeleteChat) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <SidebarMenuAction
                                showOnHover
                                className="aria-expanded:bg-muted size-6 rounded-md hover:bg-sidebar-accent cursor-pointer"
                              />
                            }
                          >
                            <MoreHorizontal className="size-3.5" />
                            <span className="sr-only">Actions</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-36 rounded-lg" side="right" align="start">
                            {onRenameChat && (
                              <DropdownMenuItem
                                onClick={() => onRenameChat(chat)}
                                className="gap-2 text-xs cursor-pointer"
                              >
                                <Edit2 className="size-3.5" />
                                Rename
                              </DropdownMenuItem>
                            )}
                            {onDeleteChat && (
                              <DropdownMenuItem
                                onClick={() => onDeleteChat(chatId)}
                                className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 3. Footer: User Profile */}
      <SidebarFooter className="border-t border-sidebar-border/40 p-2">
        <NavUser user={user} onLogout={onLogout} />
      </SidebarFooter>

      {/* 4. Rail for interactive border toggle */}
      <SidebarRail />
    </Sidebar>
  );
}
