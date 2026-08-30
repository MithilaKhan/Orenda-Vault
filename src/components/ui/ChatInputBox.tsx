'use client';

import { KeyboardEvent, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { TextArea } from './Input';

interface ChatInputBoxProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onGenerate: () => void;
  loading: boolean;
}

export function ChatInputBox({ prompt, setPrompt, onGenerate, loading }: ChatInputBoxProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !loading) {
        onGenerate();
      }
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-gradient-to-t from-[#F7F3EA] via-[#F7F3EA]/95 to-transparent">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-[#0f3d3e]/15 rounded-2xl shadow-lg overflow-hidden focus-within:border-[#0F4C3A] focus-within:ring-2 focus-within:ring-[#0F4C3A]/20 transition-all duration-200">
          {/* Input Area */}
          <div className="px-4 pt-3.5 pb-1">
            <TextArea
              className="w-full bg-transparent border-none shadow-none resize-none outline-none text-sm text-[#0f3d3e] placeholder:text-[#9CA3AF] focus:ring-0 leading-relaxed"
              style={{ boxShadow: 'none', background: 'transparent' }}
              autoSize={{ minRows: 1, maxRows: 6 }}
              placeholder="Ask anything about your knowledge vault..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown as any}
            />
          </div>

          {/* Toolbar Row */}
          <div className="flex items-center justify-between px-3 pb-3 pt-1">
            <p className="text-[11px] text-[#9CA3AF] select-none">
              Press <kbd className="px-1.5 py-0.5 rounded bg-[#0f3d3e]/5 text-[10px] font-mono text-[#4B5563] font-semibold">Enter</kbd> to send
              &nbsp;·&nbsp;
              <kbd className="px-1.5 py-0.5 rounded bg-[#0f3d3e]/5 text-[10px] font-mono text-[#4B5563] font-semibold">Shift + Enter</kbd> for new line
            </p>

            <button
              onClick={onGenerate}
              disabled={!prompt.trim() || loading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F4C3A] hover:bg-[#0F4C3A]/90 text-white text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-sm"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{loading ? 'Thinking...' : 'Send'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
