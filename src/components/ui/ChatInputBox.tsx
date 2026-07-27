import { KeyboardEvent } from "react";
import { GenerateButton } from "./GenerateButton";
import { TextArea } from "./Input";

interface ChatInputBoxProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onGenerate: () => void;
  loading: boolean;
}

export function ChatInputBox({ prompt, setPrompt, onGenerate, loading }: ChatInputBoxProps) {
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
        <div className="w-full">
          <TextArea
            className="w-full bg-transparent border-none shadow-none resize-none outline-none py-2 px-3 text-[#0f3d3e] focus:ring-0 overflow-y-auto"
            style={{ boxShadow: 'none', background: 'transparent' }}
            autoSize={{ minRows: 1, maxRows: 6 }}
            placeholder="Ask Orenda AI something..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown as any}
          />
        </div>
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
        <p className="text-xs text-[#0f3d3e]/60">
          Orenda AI may produce inaccurate information about natural systems.
        </p>
      </div>
    </div>
  );
}
