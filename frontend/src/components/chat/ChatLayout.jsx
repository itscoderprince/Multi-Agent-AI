import { useState, useEffect } from "react";
import ChatSidebar from "./sidebar/ChatSidebar";
import ChatMain from "./main/ChatMain";
import ArtifactPanel from "./artifact/ArtifactPanel";
import api from "@/utils/axios";

export default function ChatLayout({ user, onLogout }) {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("auto");
  const [isLoading, setIsLoading] = useState(false);

  // Artifact panel state
  const [isArtifactOpen, setIsArtifactOpen] = useState(false);
  const [artifactData, setArtifactData] = useState(null);

  // 1. Fetch user conversations on mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await api.get("/chat");
        const list = response.data?.data || [];
        setChats(list);
        if (list.length > 0 && !activeChatId) {
          setActiveChatId(list[0]._id || list[0].id);
        }
      } catch (err) {
        console.warn("Could not fetch chats:", err.message);
      }
    };

    if (user) {
      fetchChats();
    }
  }, [user]);

  // 2. Fetch messages when activeChatId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChatId) return;
      try {
        const response = await api.get(`/chat/${activeChatId}/messages`);
        const msgs = response.data?.data || [];
        setMessages(msgs);

        // Check if any message has code to preload in artifact
        const codeMsg = msgs.find((m) => m.content?.includes("```"));
        if (codeMsg) {
          const match = codeMsg.content.match(/```(\w+)?\n([\s\S]*?)```/);
          if (match) {
            setArtifactData({
              title: `${match[1] || "code"}-artifact`,
              language: match[1] || "javascript",
              content: match[2],
            });
          }
        }
      } catch (err) {
        console.warn("Could not fetch messages:", err.message);
      }
    };

    fetchMessages();
  }, [activeChatId]);

  // Start a new chat
  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setArtifactData(null);
    setIsArtifactOpen(false);
  };

  // Select existing chat
  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  // Delete chat
  const handleDeleteChat = async (chatId) => {
    try {
      await api.delete(`/chat/${chatId}`);
      setChats((prev) => prev.filter((c) => (c._id || c.id) !== chatId));
      if (activeChatId === chatId) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Failed to delete chat:", err.message);
    }
  };

  // Handle open artifact
  const handleOpenArtifact = (data) => {
    setArtifactData(data);
    setIsArtifactOpen(true);
  };

  // Send prompt to Agent Service via Gateway (/agent)
  const handleSendPrompt = async (promptText) => {
    if (!promptText.trim() || isLoading) return;

    // Optimistically append user message to UI
    const tempUserMsg = {
      _id: `temp-${Date.now()}`,
      role: "user",
      content: promptText,
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      // 1. Ensure we have a chat session in DB if this is a brand new chat
      let currentChatId = activeChatId;
      if (!currentChatId) {
        try {
          const title = promptText.slice(0, 30) + (promptText.length > 30 ? "..." : "");
          const createChatRes = await api.post("/chat", { title });
          const newChat = createChatRes.data?.data;
          if (newChat) {
            currentChatId = newChat._id || newChat.id;
            setActiveChatId(currentChatId);
            setChats((prev) => [newChat, ...prev]);
          }
        } catch (e) {
          console.warn("Could not auto-create chat:", e.message);
        }
      }

      // 2. Call Multi-Agent Service through API Gateway (/agent)
      const payload = {
        prompt: promptText,
        chatId: currentChatId,
        agent: selectedAgent !== "auto" ? selectedAgent : undefined,
      };

      const response = await api.post("/agent", payload);
      const resData = response.data?.data;

      if (resData) {
        const assistantMsg = {
          _id: `res-${Date.now()}`,
          role: "assistant",
          agent: resData.agent,
          content: resData.aiResponse,
        };
        setMessages((prev) => [...prev, assistantMsg]);

        // If code is detected, update artifact and auto-open
        const codeMatch = resData.aiResponse?.match(/```(\w+)?\n([\s\S]*?)```/);
        if (codeMatch) {
          setArtifactData({
            title: `${codeMatch[1] || "code"}-artifact`,
            language: codeMatch[1] || "javascript",
            content: codeMatch[2],
          });
          setIsArtifactOpen(true);
        }
      }
    } catch (err) {
      console.error("Agent error:", err);
      const errorMsg = {
        _id: `err-${Date.now()}`,
        role: "assistant",
        agent: "error",
        content:
          err.response?.data?.message ||
          "Sorry, I encountered an issue communicating with the agent service.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentChat = chats.find((c) => (c._id || c.id) === activeChatId);
  const activeTitle = currentChat?.title || "New Chat";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background font-sans antialiased text-foreground">
      {/* 1. Left Sidebar */}
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        user={user}
        onLogout={onLogout}
      />

      {/* 2. Center Chat Area */}
      <ChatMain
        chatTitle={activeTitle}
        activeAgent={selectedAgent}
        isArtifactOpen={isArtifactOpen}
        onToggleArtifact={() => setIsArtifactOpen((prev) => !prev)}
        hasArtifact={Boolean(artifactData)}
        messages={messages}
        isLoading={isLoading}
        selectedAgent={selectedAgent}
        onSelectAgent={setSelectedAgent}
        onSend={handleSendPrompt}
        onStop={() => setIsLoading(false)}
        onOpenArtifact={handleOpenArtifact}
        onSuggestionClick={handleSendPrompt}
      />

      {/* 3. Right Code Artifact Panel */}
      <ArtifactPanel
        isOpen={isArtifactOpen}
        artifact={artifactData}
        onClose={() => setIsArtifactOpen(false)}
      />
    </div>
  );
}
