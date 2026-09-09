import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fetchData from "@/features/fetchData";
import { setMessageData, clearMessageData } from "@/redux/slices/messageSlice";
import ChatNav from "./ChatNav";
import ChatMsg from "./ChatMsg";
import ChatInput from "./ChatInput";

/**
 * Main chat container assembling ChatNav, ChatMsg, and ChatInput.
 */
const Chat = () => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.chats.selectedChat);
  const [selectedPrompt, setSelectedPrompt] = useState("");

  // Fetch active conversation messages whenever selectedChat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat?._id) {
        dispatch(clearMessageData());
        return;
      }

      const data = await fetchData(`/chat/${selectedChat._id}/messages`);
      if (data) {
        dispatch(setMessageData(data));
      }
    };

    fetchMessages();
  }, [selectedChat?._id, dispatch]);

  return (
    <section className="flex-1 relative flex flex-col min-w-0 h-screen overflow-hidden bg-[#0d0f14]">
      <ChatNav />
      <div className="flex-1 relative min-h-0 w-full h-full overflow-hidden flex flex-col">
        <ChatMsg onSelectPrompt={(prompt) => setSelectedPrompt(prompt)} />

        {/* Fixed Input Bar with Transparent Backdrop Gradient */}
        <div className="absolute bottom-0 left-0 right-2 pointer-events-none z-20 bg-gradient-to-t from-[#0d0f14] via-[#0d0f14]/85 via-50% to-transparent pt-10 pb-3">
          <div className="pointer-events-auto">
            <ChatInput value={selectedPrompt} onChange={setSelectedPrompt} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chat;
