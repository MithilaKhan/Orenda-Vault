import { useEffect, useRef } from "react";
import { UserMessageBubble } from "../ui/UserMessageBubble";
import { AIMessageBubble } from "../ui/AIMessageBubble";
import { EmptyState } from "../ui/EmptyState";
import { Message } from "../../hooks/useChat";

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

export function ChatWindow({ messages, loading, onSuggestionClick }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 w-full pt-8">
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
        {messages.length === 0 && !loading ? (
          <EmptyState onSuggestionClick={onSuggestionClick} />
        ) : (
          <div className="flex flex-col pb-6">
            {messages.map((msg) =>
              msg.role === "user" ? (
                <UserMessageBubble key={msg.id} content={msg.content} />
              ) : (
                <AIMessageBubble key={msg.id} content={msg.content} />
              )
            )}
            
            {loading && (
              <AIMessageBubble content="" />
            )}
            
            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
