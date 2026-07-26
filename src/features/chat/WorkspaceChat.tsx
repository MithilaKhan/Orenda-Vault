'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WorkspaceChatMessage } from '@/types/workspace';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { 
  Sparkles, 
  Send, 
  Copy, 
  BookmarkPlus, 
  Star, 
  Share2, 
  RefreshCw, 
  Check, 
  User as UserIcon, 
  Bot,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface WorkspaceChatProps {
  messages: WorkspaceChatMessage[];
  onSendMessage: (prompt: string) => void;
  onSaveToNotes: (content: string, title?: string) => void;
  onClearHistory: () => void;
  isLoading: boolean;
}

export const WorkspaceChat: React.FC<WorkspaceChatProps> = ({
  messages,
  onSendMessage,
  onSaveToNotes,
  onClearHistory,
  isLoading,
}) => {
  const [input, setInput] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  const handleSave = (id: string, content: string) => {
    // Extract first line or clean snippet as title
    const lines = content.split('\n').filter(Boolean);
    const firstLine = lines[0]?.replace(/^#+\s*/, '') || 'AI Conversation Snippet';
    onSaveToNotes(content, firstLine.slice(0, 50));
    setSavedId(id);
    setTimeout(() => setSavedId(null), 2500);
  };

  const toggleFavorite = (id: string) => {
    setFavoritedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-3xl mx-auto px-2 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#0f3d3e]/10 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#0F4C3A] text-[#F7F3EA] shadow-soft">
            <Sparkles className="w-5 h-5 text-[#A8E063]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#0f3d3e]">Orenda AI Intelligence</h2>
            <p className="text-xs text-[#4B5563]">Centered Notion-style reading workspace</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              icon={<Trash2 className="w-4 h-4 text-red-500" />}
              className="text-red-500 hover:bg-red-500/10"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Centered Reading Width Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-6 py-4 pr-2">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant';
            const isFav = favoritedIds.has(msg.id) || msg.isFavorite;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2 border-b border-[#0f3d3e]/8 pb-6 last:border-none"
              >
                {/* Author Label */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0f3d3e]/70">
                    {isAI ? (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0f3d3e]/10 text-[#0f3d3e]">
                        <Bot className="w-3.5 h-3.5 text-[#0f3d3e]" /> Orenda AI
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#4B5563]/15 text-[#0f3d3e]">
                        <UserIcon className="w-3.5 h-3.5" /> You
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#4B5563]/70">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Message Content */}
                <div className={`text-sm sm:text-base leading-relaxed ${
                  isAI ? 'text-[#0f3d3e] font-normal' : 'text-[#0f3d3e] font-medium bg-white/60 p-4 rounded-2xl border border-[#0f3d3e]/10 shadow-soft'
                }`}>
                  {msg.content.split('\n').map((line, idx) => {
                    if (line.startsWith('### ')) {
                      return <h3 key={idx} className="text-base font-semibold text-[#0f3d3e] mt-3 mb-1">{line.replace('### ', '')}</h3>;
                    }
                    if (line.startsWith('## ')) {
                      return <h2 key={idx} className="text-lg font-semibold text-[#0f3d3e] mt-4 mb-2">{line.replace('## ', '')}</h2>;
                    }
                    if (line.startsWith('# ')) {
                      return <h1 key={idx} className="text-xl font-semibold text-[#0f3d3e] mt-4 mb-2">{line.replace('# ', '')}</h1>;
                    }
                    if (line.startsWith('- ') || line.startsWith('* ')) {
                      return <li key={idx} className="ml-4 list-disc text-sm sm:text-base my-0.5">{line.replace(/^[-*]\s*/, '')}</li>;
                    }
                    return <p key={idx} className="my-1.5 whitespace-pre-wrap">{line}</p>;
                  })}
                </div>

                {/* Response Toolbar (ONLY on AI Messages) */}
                {isAI && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/70 hover:bg-white border border-[#0f3d3e]/10 text-[#0f3d3e]/80 hover:text-[#0f3d3e] transition-all shadow-soft"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-[#A8E063]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => handleSave(msg.id, msg.content)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/70 hover:bg-white border border-[#0f3d3e]/10 text-[#0f3d3e]/80 hover:text-[#0f3d3e] transition-all shadow-soft"
                    >
                      {savedId === msg.id ? <Check className="w-3.5 h-3.5 text-[#A8E063]" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                      <span>{savedId === msg.id ? 'Saved to Vault' : 'Save'}</span>
                    </button>

                    <button
                      onClick={() => toggleFavorite(msg.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all shadow-soft ${
                        isFav ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 font-semibold' : 'bg-white/70 hover:bg-white border-[#0f3d3e]/10 text-[#0f3d3e]/80'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span>{isFav ? 'Favorited' : 'Favorite'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: 'Orenda Vault Snippet', text: msg.content });
                        } else {
                          handleCopy(msg.id, msg.content);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/70 hover:bg-white border border-[#0f3d3e]/10 text-[#0f3d3e]/80 hover:text-[#0f3d3e] transition-all shadow-soft"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>

                    <button
                      onClick={() => onSendMessage(`Please regenerate and refine your last answer:\n\n"${msg.content.slice(0, 50)}..."`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/70 hover:bg-white border border-[#0f3d3e]/10 text-[#0f3d3e]/80 hover:text-[#0f3d3e] transition-all shadow-soft ml-auto"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* AI Typing Loader Dot animation */}
        {isLoading && (
          <div className="flex items-center gap-2 py-4 text-[#0f3d3e]">
            <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/80 border border-[#0f3d3e]/10 shadow-soft text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-[#0f3d3e] animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#4B5563] animate-pulse" />
              <span>Orenda AI is thinking...</span>
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Inline Command Input for Chat View */}
      <div className="pt-4 border-t border-[#0f3d3e]/10 mb-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#0f3d3e]/20 rounded-2xl shadow-soft p-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#0f3d3e]/30 transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Type a message or instruction for Orenda AI..."
            className="w-full bg-transparent border-none text-sm text-[#0f3d3e] placeholder-[#4B5563]/70 focus:outline-none px-3 py-2"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#0F4C3A] text-[#F7F3EA] hover:bg-[#0F4C3A]/90 disabled:opacity-30 transition-all active:scale-95 shadow-soft"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
