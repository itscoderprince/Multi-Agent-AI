import { useState, useRef, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUp,
  Paperclip,
  Mic,
  Sparkles,
  Bot,
  Code2,
  FileText,
  Presentation,
  Image,
  Globe,
  ChevronUp,
  Check,
} from "lucide-react";
import api from "@/utils/axios";
import createChat from "@/features/createChat";
import { addChatData, setSelectChat } from "@/redux/slices/chatSlice";
import { addMessageData } from "@/redux/slices/messageSlice";
import { cn } from "cn";

const AGENTS = [
  { id: "auto", label: "Auto", icon: Sparkles },
  { id: "chat", label: "Chat", icon: Bot },
  { id: "coding", label: "Coding", icon: Code2 },
  { id: "pdf", label: "PDF", icon: FileText },
  { id: "ppt", label: "PPT", icon: Presentation },
  { id: "vision", label: "Vision", icon: Image },
];

/**
 * Modern AI Chat input component styled after ChatGPT / Groq / DeepSeek
 * Mobile-optimized with touch-friendly targets, iOS auto-zoom prevention,
 * and adaptive action pills.
 * Optimized with useCallback and memo for responsive keystroke performance.
 */
const ChatInput = ({ value = "", onChange, isGenerating, setIsGenerating }) => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.chats.selectedChat);
  const [localLoading, setLocalLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("auto");
  const [webSearch, setWebSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isSendingRef = useRef(false);

  const loading = isGenerating ?? localLoading;
  const setLoading = setIsGenerating ?? setLocalLoading;

  const currentAgent = AGENTS.find((a) => a.id === selectedAgent) || AGENTS[0];
  const CurrentIcon = currentAgent.icon;

  const handleSend = useCallback(async () => {
    const trimmed = value.trim();
    if (!trimmed || loading || isSendingRef.current) return;

    try {
      isSendingRef.current = true;
      setLoading(true);

      // Create chat if none is selected
      let activeChat = selectedChat;
      if (!activeChat?._id) {
        activeChat = await createChat(trimmed.slice(0, 30));
        if (!activeChat) return;
        // Tag newly created chat so Chat.jsx message fetcher doesn't race and clobber optimistic state
        const newChatObj = { ...activeChat, isNewlyCreated: true };
        dispatch(addChatData(newChatObj));
        dispatch(setSelectChat(newChatObj));
        activeChat = newChatObj;
      }

      // Optimistically display user prompt in chat
      dispatch(
        addMessageData({
          _id: `user-${Date.now()}`,
          role: "user",
          content: trimmed,
        })
      );
      onChange?.("");

      // When Search tool is enabled, route to search specialist
      const agentToSend = webSearch ? "search" : selectedAgent;

      // Call agent service
      const { data } = await api.post("/agent", {
        prompt: trimmed,
        chatId: activeChat._id,
        agent: agentToSend,
      });
      const responseData = data?.data;

      // Build assistant message from agent response
      const agentMessage = {
        _id: `agent-${Date.now()}`,
        role: "assistant",
        content: responseData?.aiResponse || "No response received.",
        images: responseData?.images || [],
        artifact: responseData?.artifact || null,
        uiFiles: responseData?.uiFiles || null,
      };
      dispatch(addMessageData(agentMessage));
    } catch (err) {
      console.error("Failed to get agent response:", err);
      dispatch(
        addMessageData({
          _id: `err-${Date.now()}`,
          role: "assistant",
          content:
            "Sorry, I encountered an error connecting to the agent. Please try again.",
        })
      );
    } finally {
      setLoading(false);
      isSendingRef.current = false;
    }
  }, [value, loading, selectedChat, selectedAgent, webSearch, dispatch, onChange, setLoading]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) {
        handleSend();
      }
    }
  }, [loading, handleSend]);

  const hasText = Boolean(value.trim());

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4">
      {/* Input Box Container */}
      <div className="rounded-[22px] sm:rounded-[26px] bg-[#1e1e1e] border border-white/10 p-2.5 sm:p-3.5 shadow-xl transition-colors focus-within:border-white/20">
        <Textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message SarthiAi (${currentAgent.label}${webSearch ? " + Search" : ""})`}
          rows={1}
          className="no-scrollbar scrollbar-none [&::-webkit-scrollbar]:hidden min-h-10 sm:min-h-11 max-h-32 sm:max-h-36 resize-none rounded-none border-0! border-none! border-transparent! bg-transparent! dark:bg-transparent! disabled:bg-transparent! dark:disabled:bg-transparent! disabled:border-0! disabled:border-transparent! shadow-none! outline-none! ring-0! focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:border-transparent px-1.5 py-1 text-[16px] sm:text-[15px] text-slate-100 placeholder:text-zinc-500 leading-relaxed"
        />

        {/* Bottom Controls Bar */}
        <div className="flex items-center justify-between pt-1.5 sm:pt-2 gap-1.5">
          {/* Left Actions: Mode Selector & Dedicated Search Tool */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            {/* Mode / Agent Selector Pill */}
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "h-7 sm:h-8 rounded-full px-2.5 sm:px-3 text-xs sm:text-[13px] font-medium flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer outline-none select-none border shrink-0",
                    selectedAgent !== "auto"
                      ? "bg-white/10 border-white/20 text-white shadow-sm hover:bg-white/15"
                      : "bg-[#202020] border-transparent text-zinc-300 hover:bg-[#282828] hover:text-white"
                  )}
                >
                  <CurrentIcon
                    className={cn(
                      "size-3 sm:size-3.5 shrink-0",
                      selectedAgent !== "auto" ? "text-white" : "text-zinc-400"
                    )}
                  />
                  <span className="truncate max-w-[55px] sm:max-w-none">{currentAgent.label}</span>
                  <ChevronUp
                    className={cn(
                      "size-2.5 sm:size-3 text-zinc-400 transition-transform duration-200 shrink-0",
                      menuOpen && "rotate-180"
                    )}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                side="top"
                sideOffset={10}
                className="w-60 bg-[#181818] border border-[#2a2a2a] text-white p-1.5 shadow-2xl rounded-2xl animate-in fade-in-0 zoom-in-95 z-50"
              >
                <div className="flex flex-col gap-0.5">
                  {AGENTS.map((agentItem) => {
                    const Icon = agentItem.icon;
                    const isSelected = selectedAgent === agentItem.id;
                    return (
                      <DropdownMenuItem
                        key={agentItem.id}
                        onClick={() => {
                          setSelectedAgent(agentItem.id);
                          setMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-[13.5px] font-medium transition-colors text-zinc-200 hover:bg-[#252525] hover:text-white outline-none select-none",
                          isSelected && "text-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="size-4 text-zinc-300 stroke-[1.8]" />
                          <span>{agentItem.label}</span>
                        </div>
                        {isSelected && (
                          <Check className="size-4 text-zinc-200 stroke-[2.2]" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </div>

                {/* Bottom Upgrade Card */}
                <div className="bg-[#242424] rounded-xl p-2.5 mt-1 flex items-center justify-between gap-2 border border-white/5">
                  <div className="flex flex-col text-left pl-0.5">
                    <span className="text-[13px] font-semibold text-white tracking-tight leading-tight">
                      SuperSarathi
                    </span>
                    <span className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                      Unlock extended capabilities
                    </span>
                  </div>
                  <button
                    type="button"
                    className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0"
                  >
                    Upgrade
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Tool Button inside chat controls */}
            <button
              type="button"
              onClick={() => setWebSearch((prev) => !prev)}
              className={cn(
                "h-7 sm:h-8 rounded-full px-2.5 sm:px-3 text-xs sm:text-[13px] gap-1 sm:gap-1.5 font-medium flex items-center transition-all cursor-pointer border select-none shrink-0",
                webSearch
                  ? "bg-white/15 border-white/20 text-white"
                  : "bg-[#202020] border-transparent text-zinc-300 hover:bg-[#282828] hover:text-white"
              )}
              title="Toggle real-time web search"
            >
              <Globe className={cn("size-3 sm:size-3.5 shrink-0", webSearch ? "text-white" : "text-zinc-400")} />
              <span>Search</span>
            </button>
          </div>

          {/* Right Actions: Attachment, Mic, and Send */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7 sm:size-7.5 text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer shrink-0"
              title="Attach files"
            >
              <Paperclip className="size-3.5 sm:size-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7 sm:size-7.5 text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer shrink-0"
              title="Voice input"
            >
              <Mic className="size-3.5 sm:size-4" />
            </Button>

            <Button
              type="button"
              onClick={handleSend}
              disabled={!hasText || loading}
              size="icon"
              className={cn(
                "size-7.5 sm:size-8 rounded-full transition-all cursor-pointer shrink-0",
                hasText && !loading
                  ? "bg-white hover:bg-zinc-200 text-black shadow-sm active:scale-95"
                  : "bg-[#282828] text-zinc-500 disabled:opacity-40 cursor-not-allowed",
              )}
              title="Send message"
            >
              <ArrowUp className="size-3.5 sm:size-4 stroke-[2.5]" />
            </Button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] sm:text-xs text-zinc-500 text-center mt-1.5 font-normal tracking-tight truncate px-2">
        This website is created by prince sharma 🤴
      </p>
    </div>
  );
};

export default memo(ChatInput);
