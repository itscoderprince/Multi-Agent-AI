import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fetchData from "@/features/fetchData";
import { setMessageData, clearMessageData } from "@/redux/slices/messageSlice";
import ChatNav from "./ChatNav";
import ChatMsg from "./messages/ChatMsg";
import ChatInput from "./ChatInput";

/**
 * Main chat container assembling ChatNav, ChatMsg, and ChatInput.
 */
const Chat = () => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.chats.selectedChat);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch active conversation messages whenever selectedChat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat?._id) {
        dispatch(clearMessageData());
        return;
      }

      const data = await fetchData(`/chat/${selectedChat._id}/messages`);
      if (data && data.length > 0) {
        dispatch(setMessageData(data));
      }
    };

    fetchMessages();
  }, [selectedChat?._id, dispatch]);

  return (
    <section className="flex-1 relative flex flex-col min-w-0 h-screen overflow-hidden bg-[#0a0c10] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]">
      <ChatNav />
      <div className="flex-1 relative min-h-0 w-full h-full overflow-hidden flex flex-col">
        <ChatMsg
          onSelectPrompt={(prompt) => setSelectedPrompt(prompt)}
          isGenerating={isGenerating}
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
