'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { WorkspaceChatMessage } from '@/types/workspace';
import { Button } from '@/components/ui/Button';
import {
  Copy,
  RefreshCw,
  Check,
  User as UserIcon,
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);


  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-210px)] sm:h-[calc(100vh-185px)] lg:h-[calc(100vh-150px)] max-w-3xl mx-auto px-2 sm:px-4">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-4 border-b border-[#0f3d3e]/10 mb-4">
        <div className="flex items-center gap-3">
          {/* Fix 1 – real PNG logo, cropped */}
          <span
            className="inline-flex items-center justify-center overflow-hidden rounded-xl shadow-soft flex-shrink-0"
            style={{ width: 44, height: 44 }}
          >
            <Image
              src="/logo-mockup.png"
              alt="Orenda Vault"
              width={70}
              height={70}
              style={{ objectFit: 'cover', width: 70, height: 70 }}
              priority
            />
          </span>
          <div>
            <h2 className="text-lg font-bold text-[#0f3d3e] leading-tight">Orenda Vault</h2>
            <p className="text-xs text-[#4B5563]">Your personal AI knowledge assistant</p>
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

      {/* ── Messages Area – scrollbar hidden (Fix 3) ────────── */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col w-full mb-4 md:mb-8 ${isAI ? 'items-start' : 'items-end'}`}
              >
                {/* ── Author Label ── */}
                <div className={`flex items-center gap-2 mb-1.5 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0f3d3e]/70">
                    {isAI ? (
                      /* Fix 2 – logo icon only, no text */
                      <span className="flex items-center gap-1  ">

                        <Image src="/logo-mockup.png" alt="Orenda Vault" width={40} height={40} style={{ objectFit: 'cover', width: 40, height: 40 }} className='rounded-md rounded-rb-sm' />

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

                {/* ── Message Content (Fix 4 & 5 – no outer box, tight padding on user bubble) ── */}
                <div className={`text-sm sm:text-base leading-relaxed text-left ${isAI
                  ? 'text-[#0f3d3e] font-normal w-full max-w-[95%] sm:max-w-[85%]'
                  : 'text-[#0f3d3e] font-medium bg-white/60 py-2 px-3 rounded-2xl rounded-tr-sm border border-[#0f3d3e]/10 shadow-soft'
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
                    return <p key={idx} className="my-1 whitespace-pre-wrap">{line}</p>;
                  })}
                </div>

                {/* ── Response Toolbar (AI only) ── */}
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

        {/* AI Typing Loader */}
        {isLoading && (
          <div className="flex items-center gap-2 py-4 text-[#0f3d3e]">
            <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/80 border border-[#0f3d3e]/10 shadow-soft text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-[#0f3d3e] animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#4B5563] animate-pulse" />
              <span>Thinking...</span>
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

