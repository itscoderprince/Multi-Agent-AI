import * as React from "react"
import { useSidebar } from "@/components/ui/sidebar"
import { PanelLeftIcon, MessageCirclePlusIcon } from "lucide-react"
import { PeacockFeatherIcon } from "@/components/icons/PeacockFeatherIcon"
import { ChatInput } from "./ChatInput"
import { ChatMessageList } from "./ChatMessageList"
import { ChatEmptyState } from "./ChatEmptyState"

export function ChatArea({
  messages = [],
  selectedAgent = "auto",
  onSelectAgent,
  onOpenArtifact,
  onSendMessage,
  onNewChat,
}) {
  const { open, toggleSidebar } = useSidebar()
  const [input, setInput] = React.useState("")
  const [isSearchActive, setIsSearchActive] = React.useState(true)
  const [isImageActive, setIsImageActive] = React.useState(false)

  const handleSend = () => {
    if (!input.trim()) return
    onSendMessage?.(input.trim())
    setInput("")
  }

  const inputProps = {
    input,
    setInput,
    onSend: handleSend,
    selectedAgent,
    onSelectAgent,
    isSearchActive,
    setIsSearchActive,
    isImageActive,
    setIsImageActive,
  }

  return (
    <div className="relative flex-1 flex flex-col h-full overflow-hidden bg-[#131315] text-neutral-100">
      {/* Floating Sidebar Toggle + New Chat (visible only when sidebar is closed) */}
      {!open && (
        <div className="absolute top-3.5 left-3.5 z-30 flex items-center gap-2.5 animate-in fade-in-0 duration-200">
          <PeacockFeatherIcon className="size-8 shrink-0 drop-shadow-sm" />
          <div className="flex items-center gap-1.5 bg-[#252528] border border-neutral-700/60 rounded-full px-2.5 py-1.5 shadow-md">
            <button
              type="button"
              onClick={toggleSidebar}
              className="text-neutral-300 hover:text-white transition-colors cursor-pointer p-0.5 rounded-full hover:bg-neutral-700/50"
              title="Open sidebar"
            >
              <PanelLeftIcon className="size-4" />
              <span className="sr-only">Open sidebar</span>
            </button>
            <div className="w-px h-3.5 bg-neutral-700/60" />
            <button
              type="button"
              onClick={onNewChat}
              className="text-neutral-300 hover:text-white transition-colors cursor-pointer p-0.5 rounded-full hover:bg-neutral-700/50"
              title="New chat"
            >
              <MessageCirclePlusIcon className="size-4" />
              <span className="sr-only">New chat</span>
            </button>
          </div>
        </div>
      )}

      {/* Main View: Centered Input on New Chat, or Message Stream + Bottom Dock */}
      {messages.length === 0 ? (
        <ChatEmptyState {...inputProps} />
      ) : (
        <>
          <ChatMessageList
            messages={messages}
            onOpenArtifact={onOpenArtifact}
          />
          <div className="p-4 bg-[#131315]/95 backdrop-blur shrink-0">
            <div className="max-w-3xl mx-auto">
              <ChatInput {...inputProps} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ChatArea
