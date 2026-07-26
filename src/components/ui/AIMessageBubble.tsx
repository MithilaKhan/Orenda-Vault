import { Sparkles } from "lucide-react";

interface AIMessageBubbleProps {
  content: string;
}

function parseMarkdown(text: string) {
  return text.split("\n").map((line, idx) => {
    let cleanLine = line;
    const isBullet = cleanLine.startsWith("- ") || cleanLine.startsWith("* ");
    if (isBullet) cleanLine = cleanLine.slice(2);

    const parts = cleanLine.split(/\*\*(.*?)\*\*/g);
    const content = parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));

    if (isBullet) {
      return <li key={idx} className="ml-4 list-disc">{content}</li>;
    }
    return cleanLine.trim() === "" ? <div key={idx} className="h-2" /> : <p key={idx} className="m-0 leading-relaxed">{content}</p>;
  });
}

export function AIMessageBubble({ content }: AIMessageBubbleProps) {
  return (
    <div className="flex justify-start w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex gap-4 max-w-[85%]">
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-[#185A5B] flex items-center justify-center shrink-0 shadow-md">
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
        <div className="bg-message-ai text-primary px-6 py-5 rounded-2xl rounded-tl-sm shadow-sm border border-border-color">
          <div className="prose prose-sm md:prose-base prose-green max-w-none flex flex-col gap-2">
            {content ? parseMarkdown(content) : (
              <div className="flex gap-1 items-center h-6">
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
