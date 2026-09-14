import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Layers } from "lucide-react";
import fetchData from "@/features/fetchData";
import {
  setMessageData,
  clearMessageData,
  toggleArtifactOpen,
} from "@/redux/slices/messageSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ChatMsg from "./messages/ChatMsg";
import ChatInput from "./ChatInput";

/**
 * Main chat area (ChatGPT / DeepSeek style).
 * Minimalist borderless layout with floating top-right tools and zero bulky navbar clutter.
 */
const Chat = () => {
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

  return (
    <section className="flex-1 relative flex flex-col min-w-0 h-screen overflow-hidden bg-[#0a0c10] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.08),rgba(255,255,255,0))]">
      {/* Sleek Floating Top-Right Tools (ChatGPT style) */}
      {artifacts.length > 0 && (
        <div className="absolute top-3 right-4 z-30">
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
        <div className="absolute bottom-0 left-0 right-2 pointer-events-none z-20 bg-linear-to-t from-[#0a0c10] via-[#0a0c10]/90 via-60% to-transparent pt-6 pb-3">
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
