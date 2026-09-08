import { PeacockFeatherIcon } from "@/components/icons/PeacockFeatherIcon"
import { ChatInput } from "./ChatInput"

export function ChatEmptyState({
  input,
  setInput,
  onSend,
  selectedAgent,
  onSelectAgent,
  isSearchActive,
  setIsSearchActive,
  isImageActive,
  setIsImageActive,
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 w-full max-w-3xl mx-auto my-auto animate-in fade-in-50 duration-300">
      {/* Brand Hero Greeting */}
      <div className="flex flex-col items-center text-center space-y-3 mb-6">
        <div className="flex items-center justify-center gap-3">
          <PeacockFeatherIcon className="size-8.5 md:size-9 shrink-0 drop-shadow-md" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-100 font-sans">
            sarthi<span className="text-[#4D6BFE]">Ai</span>
          </h1>
        </div>
        <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
          What can I help you build or explore today?
        </p>
      </div>

      {/* Centered Chat Input Box */}
      <div className="w-full">
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={onSend}
          selectedAgent={selectedAgent}
          onSelectAgent={onSelectAgent}
          isSearchActive={isSearchActive}
          setIsSearchActive={setIsSearchActive}
          isImageActive={isImageActive}
          setIsImageActive={setIsImageActive}
          className="shadow-2xl"
        />
      </div>
    </div>
  )
}

export default ChatEmptyState
