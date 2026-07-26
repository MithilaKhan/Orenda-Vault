import { useEffect, useRef, KeyboardEvent } from "react";
import { GenerateButton } from "./GenerateButton";

interface ChatInputBoxProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onGenerate: () => void;
  loading: boolean;
}

export function ChatInputBox({ prompt, setPrompt, onGenerate, loading }: ChatInputBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !loading) {
        onGenerate();
      }
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 p-4 md:p-6 bg-linear-to-t from-background via-background to-transparent pt-10">
      <div className="max-w-4xl mx-auto relative group flex items-center gap-2 bg-white border border-border-color rounded-3xl p-2 transition-shadow duration-300 focus-within:shadow-[0_4px_5px_rgba(163,255,18,0.15)] focus-within:border-[rgba(113,175,14,0.5)]">
        <textarea
          ref={textareaRef}
          className="w-full max-h-[200px] bg-transparent resize-none outline-none py-2 px-3 text-primary placeholder:text-primary/50 focus:ring-0 overflow-y-auto"
          rows={1}
          placeholder="Ask Orenda AI something..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="shrink-0 p-1">
          <GenerateButton
            loading={loading}
            onClick={onGenerate}
            disabled={!prompt.trim()}
            className="rounded-2xl py-2 px-5"
          />
        </div>
      </div>
      <div className="text-center mt-3">
        <p className="text-xs text-primary/60">
          Orenda AI may produce inaccurate information about natural systems.
        </p>
      </div>
    </div>
  );
}
