import * as React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import AppSidebar from "./AppSidebar"
import ChatArea from "./ChatArea"
import { AGENTS } from "./agents"
import ArtifactPanel from "./ArtifactPanel"

export function ChatPage({ user, onLogout }) {
  const [chats, setChats] = React.useState([])
  const [activeChatId, setActiveChatId] = React.useState(null)
  const [selectedAgent, setSelectedAgent] = React.useState("auto")
  const [isArtifactOpen, setIsArtifactOpen] = React.useState(false)
  const [artifactData, setArtifactData] = React.useState(null)
  const [messages, setMessages] = React.useState([])

  const activeChat = chats.find((c) => c.id === activeChatId)

  const handleNewChat = () => {
    setActiveChatId(null)
    setMessages([])
    setIsArtifactOpen(false)
    setArtifactData(null)
  }

  const handleSelectChat = (id) => {
    setActiveChatId(id)
    // In real app, load chat messages for this conversation id
  }

  const handleDeleteChat = (id) => {
    const updated = chats.filter((c) => c.id !== id)
    setChats(updated)
    if (activeChatId === id) {
      if (updated.length > 0) {
        setActiveChatId(updated[0].id)
      } else {
        handleNewChat()
      }
    }
  }

  const handleSendMessage = (text) => {
    let currentId = activeChatId
    if (!currentId) {
      currentId = String(Date.now())
      const title = text.length > 26 ? `${text.slice(0, 26)}...` : text
      const newChat = { id: currentId, title }
      setChats((prev) => [newChat, ...prev])
      setActiveChatId(currentId)
    }

    const userMsg = {
      id: `m-${Date.now()}`,
      role: "user",
      content: text,
      time: "Just now",
    }

    setMessages((prev) => [...prev, userMsg])

    // Minimal UI stub response (no AI agent logic)
    setTimeout(() => {
      const activeAgentObj = AGENTS.find((a) => a.id === selectedAgent)
      const botMsg = {
        id: `m-${Date.now() + 1}`,
        role: "assistant",
        agent: activeAgentObj?.name || "Coding",
        content: `Acknowledged: "${text}". Ready to assist with ${activeAgentObj?.name || "selected"} agent.`,
        time: "Just now",
      }
      setMessages((prev) => [...prev, botMsg])
    }, 400)
  }

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar
        user={user}
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onLogout={onLogout}
      />
      <SidebarInset className="flex flex-row h-screen overflow-hidden">
        <ChatArea
          activeChatTitle={activeChat?.title || "New Chat"}
          messages={messages}
          selectedAgent={selectedAgent}
          onSelectAgent={setSelectedAgent}
          isArtifactOpen={isArtifactOpen}
          onToggleArtifact={() => setIsArtifactOpen((prev) => !prev)}
          onOpenArtifact={(artifact) => {
            setArtifactData(artifact)
            setIsArtifactOpen(true)
          }}
          onSendMessage={handleSendMessage}
          onNewChat={handleNewChat}
        />
        {isArtifactOpen && (
          <ArtifactPanel
            artifact={artifactData}
            onClose={() => setIsArtifactOpen(false)}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default ChatPage
