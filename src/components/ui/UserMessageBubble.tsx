interface UserMessageBubbleProps {
  content: string;
}

export function UserMessageBubble({ content }: UserMessageBubbleProps) {
  return (
    <div className="flex justify-end w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-[80%] bg-message-user text-primary px-5 py-4 rounded-2xl rounded-tr-sm shadow-sm border border-[rgba(163,255,18,0.2)]">
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
