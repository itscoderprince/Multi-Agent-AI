import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, Globe, Paperclip, Mic, Loader2 } from "lucide-react";
import api from "@/utils/axios";
import createChat from "@/features/createChat";
import { addChatData, setSelectChat } from "@/redux/slices/chatSlice";
import { addMessageData } from "@/redux/slices/messageSlice";
import { cn } from "cn";

/**
 * Modern AI Chat input component styled after DeepSeek / ChatGPT.
 */
const ChatInput = ({ value = "", onChange }) => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.chats.selectedChat);
  const [loading, setLoading] = useState(false);
  const [webSearch, setWebSearch] = useState(true);

  const handleSend = async () => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;

    try {
      setLoading(true);

      let activeChat = selectedChat;
      if (!activeChat?._id) {
        activeChat = await createChat(trimmed.slice(0, 30));
        if (!activeChat) return;
        dispatch(addChatData(activeChat));
        dispatch(setSelectChat(activeChat));
      }

      const { data } = await api.post(`/chat/${activeChat._id}/messages`, {
        content: trimmed,
        role: "user",
      });

      const savedMessage = data?.data || data;
      if (savedMessage) dispatch(addMessageData(savedMessage));
      onChange?.("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasText = Boolean(value.trim());

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* DeepSeek Style Rounded Container */}
      <div className="rounded-[26px] bg-[#22242a] p-3.5 shadow-xl transition-all">
        <Textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message SarthiAi"
          rows={1}
          disabled={loading}
          className="no-scrollbar scrollbar-none [&::-webkit-scrollbar]:hidden min-h-11 max-h-36 resize-none rounded-none border-0 border-transparent bg-transparent dark:bg-transparent px-1 py-1 text-[15px] text-slate-100 placeholder:text-zinc-500 shadow-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:border-transparent leading-relaxed"
        />

        {/* Bottom Controls Bar */}
        <div className="flex items-center justify-between pt-2">
          {/* Left Action: Search Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setWebSearch((prev) => !prev)}
            className={cn(
              "h-8 rounded-full px-3 text-xs gap-1.5 font-medium transition-colors cursor-pointer",
              webSearch
                ? "bg-[#18263f] border-[#294a82] text-[#4d8eff] hover:bg-[#1f3254] hover:text-[#4d8eff]"
                : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white"
            )}
          >
            <Globe className="size-3.5" />
            <span>Search</span>
          </Button>

          {/* Right Actions: Attachment, Mic, and Send */}
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7 text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
              title="Attach files"
            >
              <Paperclip className="size-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7 text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
              title="Voice input"
            >
              <Mic className="size-4" />
            </Button>

            <Button
              type="button"
              onClick={handleSend}
              disabled={!hasText || loading}
              size="icon"
              className={cn(
                "size-8 rounded-full transition-all cursor-pointer",
                hasText && !loading
                  ? "bg-[#3e5cd6] hover:bg-[#4d6de6] text-white shadow-md active:scale-95"
                  : "bg-[#282d38] text-zinc-500 disabled:opacity-50 cursor-not-allowed"
              )}
              title="Send message"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin text-white" />
              ) : (
                <ArrowUp className="size-4 stroke-[2.5]" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-zinc-500 text-center mt-2 font-normal tracking-tight">
        AI-generated, for reference only
      </p>
    </div>
  );
};

export default ChatInput;