import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Layers, PanelLeft, SquarePen } from "lucide-react";
import fetchData from "@/features/fetchData";
import {
  setMessageData,
  clearMessageData,
  toggleArtifactOpen,
} from "@/redux/slices/messageSlice";
import { setSelectChat } from "@/redux/slices/chatSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ChatMsg from "./messages/ChatMsg";
import ChatInput from "./ChatInput";

/**
 * Main chat area with full mobile responsiveness (ChatGPT style).
 * Includes sticky top mobile header with hamburger drawer toggle and New Chat shortcut,
 * alongside desktop borderless layout.
 */
const Chat = ({ onOpenMobileSidebar }) => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.chats.selectedChat);
  const artifacts = useSelector((state) => state.messages.artifacts);
  const isArtifactOpen = useSelector((state) => state.messages.isArtifactOpen);

  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Fetch active conversation messages whenever selectedChat changes
  useEffect(() => {
    let isCancelled = false;

    const fetchMessages = async () => {
      if (!selectedChat?._id) {
        dispatch(clearMessageData());
        setIsLoadingMessages(false);
        setIsGenerating(false);
        return;
      }

      // If chat is newly created in this session, skip initial fetch
      if (selectedChat.isNewlyCreated) {
        setIsLoadingMessages(false);
        return;
      }

      // Indicate messages are loading immediately when switching chats
      setIsLoadingMessages(true);

      try {
        const data = await fetchData(`/chat/${selectedChat._id}/messages`);
        if (!isCancelled) {
          if (data && data.length > 0) {
            dispatch(setMessageData(data));
          } else {
            dispatch(clearMessageData());
          }
        }
      } catch (err) {
        console.error("Error loading chat messages:", err);
      } finally {
        if (!isCancelled) {
          setIsLoadingMessages(false);
        }
      }
    };

    fetchMessages();

    return () => {
      isCancelled = true;
    };
  }, [selectedChat?._id, dispatch]);

  const handleNewChat = () => {
    dispatch(setSelectChat(null));
    dispatch(clearMessageData());
  };

  return (
    <section className="flex-1 relative flex flex-col min-w-0 h-screen overflow-hidden bg-[#0a0c10] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.08),rgba(255,255,255,0))]">
      {/* ChatGPT-style Mobile Top Header Bar (< lg) */}
      <header className="h-13 border-b border-white/8 bg-[#0a0c10]/95 backdrop-blur-md px-3 flex items-center justify-between z-30 lg:hidden shrink-0">
        {/* Left: Hamburger Menu Icon & Branding */}
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onOpenMobileSidebar}
            className="text-zinc-400 hover:text-white cursor-pointer -ml-1 size-9 shrink-0"
            aria-label="Open sidebar menu"
          >
            <PanelLeft className="size-5" />
          </Button>

          <div className="flex items-center gap-1.5 min-w-0">
            <img src="/favicon.svg" alt="SarthiAi" className="size-5 shrink-0" />
            <span className="text-sm font-semibold text-slate-100 truncate tracking-tight">
              {selectedChat?.title || "SarthiAi"}
            </span>
          </div>
        </div>

        {/* Right: Canvas indicator & New Chat Shortcut */}
        <div className="flex items-center gap-1 shrink-0">
          {artifacts.length > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => dispatch(toggleArtifactOpen())}
              className={`h-8 px-2 rounded-lg text-xs gap-1 cursor-pointer transition-all ${
                isArtifactOpen
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
              title="Toggle Canvas"
            >
              <Layers className="size-3.5 text-emerald-400" />
              <Badge
                variant="outline"
                className="h-4 px-1 text-[9px] font-mono border-emerald-500/30 text-emerald-400"
              >
                {artifacts.length}
              </Badge>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleNewChat}
            className="text-zinc-400 hover:text-white cursor-pointer size-9 shrink-0"
            title="New Chat"
            aria-label="New chat"
          >
            <SquarePen className="size-4.5" />
          </Button>
        </div>
      </header>

      {/* Sleek Floating Top-Right Tools on Desktop (hidden on mobile header) */}
      {artifacts.length > 0 && (
        <div className="absolute top-3 right-4 z-30 hidden lg:block">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => dispatch(toggleArtifactOpen())}
            className={`h-8 px-2.5 rounded-lg text-xs gap-1.5 transition-all cursor-pointer backdrop-blur-md ${
              isArtifactOpen
                ? "bg-white/10 text-white border border-white/10 shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
            title="Toggle Canvas / Artifact"
          >
            <Layers className="size-3.5 text-emerald-400" />
            <span>Canvas</span>
            <Badge
              variant="outline"
              className="h-4 px-1 text-[9px] font-mono border-emerald-500/30 text-emerald-400"
            >
              {artifacts.length}
            </Badge>
          </Button>
        </div>
      )}

      {/* Main Chat Message Viewport */}
      <div className="flex-1 relative min-h-0 w-full h-full overflow-hidden flex flex-col">
        <ChatMsg
          onSelectPrompt={(prompt) => setSelectedPrompt(prompt)}
          isGenerating={isGenerating}
          isLoading={isLoadingMessages}
        />

        {/* Fixed Input Bar with Transparent Backdrop Gradient */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-20 bg-linear-to-t from-[#0a0c10] via-[#0a0c10]/95 via-60% to-transparent pt-6 pb-2 sm:pb-3">
          <div className="pointer-events-auto">
            <ChatInput
              value={selectedPrompt}
              onChange={setSelectedPrompt}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chat;
