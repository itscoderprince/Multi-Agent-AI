import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessageItem } from "./ChatMessageItem"

export function ChatMessageList({ messages = [], onOpenArtifact }) {
  const scrollBottomRef = React.useRef(null)

  React.useEffect(() => {
    if (messages.length > 0) {
      scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <ScrollArea className="flex-1 p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((msg) => (
          <ChatMessageItem
            key={msg.id}
            msg={msg}
            onOpenArtifact={onOpenArtifact}
          />
        ))}
        <div ref={scrollBottomRef} />
      </div>
    </ScrollArea>
  )
}

export default ChatMessageList
