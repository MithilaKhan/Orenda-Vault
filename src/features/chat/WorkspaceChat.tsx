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
  Trash2,
  FileEdit,
  FolderPlus,
  Search,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface WorkspaceChatProps {
  messages: WorkspaceChatMessage[];
  onSendMessage: (prompt: string) => void;
  onSaveToNotes: (content: string, title?: string) => void;
  onClearHistory: () => void;
  isLoading: boolean;
  isHistoryLoading?: boolean;
}

const SUGGESTION_PROMPTS = [
  {
    icon: <FileEdit className="w-4 h-4 text-[#0F4C3A]" />,
    title: 'Create a note',
    description: 'Draft a new note or save a quick snippet',
    prompt: 'Help me create a new note',
  },
  {
    icon: <FolderPlus className="w-4 h-4 text-[#0F4C3A]" />,
    title: 'List collections',
    description: 'Show all your organized collections',
    prompt: 'Show all my collections',
  },
  {
    icon: <Search className="w-4 h-4 text-[#0F4C3A]" />,
    title: 'Search notes & collections',
    description: 'Find any note or collection in your vault',
    prompt: 'List all my saved notes and collections',
  },
  {
    icon: <Sparkles className="w-4 h-4 text-[#0F4C3A]" />,
    title: 'Summarize notes',
    description: 'Extract key insights from your saved notes',
    prompt: 'Summarize all my saved notes',
  },
];

export const WorkspaceChat: React.FC<WorkspaceChatProps> = ({
  messages,
  onSendMessage,
  onSaveToNotes,
  onClearHistory,
  isLoading,
  isHistoryLoading = false,
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
    <div className="flex flex-col max-w-3xl mx-auto px-2 sm:px-4 pb-4">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-3 border-b border-[#0f3d3e]/10 mb-2">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center overflow-hidden rounded-xl shadow-soft flex-shrink-0"
            style={{ width: 38, height: 38 }}
          >
            <Image
              src="/logo-mockup.png"
              alt="Orenda Vault"
              width={60}
              height={60}
              style={{ objectFit: 'cover', width: 60, height: 60 }}
              priority
            />
          </span>
          <div>
            <h2 className="text-base font-bold text-[#0f3d3e] leading-tight">Orenda Vault</h2>
            <p className="text-xs text-[#4B5563]">Your personal AI knowledge assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && !isHistoryLoading && (
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

      {/* ── Main Content Area ───────────────────────────────── */}
      {isHistoryLoading ? (
        /* Loading Skeleton State – prevents welcome message flicker */
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-12">
          <div className="w-12 h-12 rounded-2xl bg-[#0f3d3e]/10 animate-pulse flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#0F4C3A] animate-spin" />
          </div>
          <div className="text-sm font-medium text-[#4B5563] animate-pulse">
            Loading your conversation history...
          </div>
        </div>
      ) : messages.length === 0 ? (
        /* ChatGPT-style Empty Home Layout – Orenda Vault Theme */
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center mb-8"
          >
            <span
              className="inline-flex items-center justify-center overflow-hidden rounded-2xl shadow-soft mb-4"
              style={{ width: 56, height: 56 }}
            >
              <Image
                src="/logo-mockup.png"
                alt="Orenda Vault"
                width={80}
                height={80}
                style={{ objectFit: 'cover', width: 80, height: 80 }}
                priority
              />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0f3d3e] tracking-tight">
              What's on your mind today?
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563] mt-2 max-w-md">
              Create notes, manage collections, or search your knowledge base through natural conversation.
            </p>
          </motion.div>

          {/* Quick Action Suggestion Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
            {SUGGESTION_PROMPTS.map((sug, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                onClick={() => onSendMessage(sug.prompt)}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 hover:bg-white border border-[#0f3d3e]/10 text-left transition-all duration-200 hover:shadow-md hover:border-[#0F4C3A]/30 group cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-[#0F4C3A]/10 group-hover:border-[#0F4C3A] transition-all shrink-0">
                  {sug.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#0f3d3e]">{sug.title}</div>
                  <div className="text-xs text-[#4B5563] mt-0.5">{sug.description}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        /* Chat Messages List */
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
                  className={`flex flex-col w-full mb-4 md:mb-6 ${isAI ? 'items-start' : 'items-end'}`}
                >
                  {/* Author Label */}
                  <div className={`flex items-center gap-2 mb-1.5 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0f3d3e]/70">
                      {isAI ? (
                        <span className="flex items-center gap-1">
                          <Image
                            src="/logo-mockup.png"
                            alt="Orenda Vault"
                            width={32}
                            height={32}
                            style={{ objectFit: 'cover', width: 32, height: 32 }}
                            className="rounded-md"
                          />
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
                  <div
                    className={`text-sm sm:text-base leading-relaxed text-left ${isAI
                      ? 'text-[#0f3d3e] font-normal w-full max-w-[95%] sm:max-w-[85%]'
                      : 'text-[#0f3d3e] font-medium bg-white/60 py-2 px-3.5 rounded-2xl rounded-tr-sm border border-[#0f3d3e]/10 shadow-soft'
                      }`}
                  >
                    {msg.content.split('\n').map((line, idx) => {
                      if (line.startsWith('### ')) {
                        return (
                          <h3 key={idx} className="text-base font-semibold text-[#0f3d3e] mt-3 mb-1">
                            {line.replace('### ', '')}
                          </h3>
                        );
                      }
                      if (line.startsWith('## ')) {
                        return (
                          <h2 key={idx} className="text-lg font-semibold text-[#0f3d3e] mt-4 mb-2">
                            {line.replace('## ', '')}
                          </h2>
                        );
                      }
                      if (line.startsWith('# ')) {
                        return (
                          <h1 key={idx} className="text-xl font-semibold text-[#0f3d3e] mt-4 mb-2">
                            {line.replace('# ', '')}
                          </h1>
                        );
                      }
                      if (line.startsWith('- ') || line.startsWith('* ')) {
                        return (
                          <li key={idx} className="ml-4 list-disc text-sm sm:text-base my-0.5">
                            {line.replace(/^[-*]\s*/, '')}
                          </li>
                        );
                      }
                      return (
                        <p key={idx} className="my-1 whitespace-pre-wrap">
                          {line}
                        </p>
                      );
                    })}
                  </div>

                    {/* Response Toolbar (AI only) */}
                  {isAI && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/70 hover:bg-white border border-[#0f3d3e]/10 text-[#0f3d3e]/80 hover:text-[#0f3d3e] transition-all shadow-soft"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-[#0F4C3A]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => onSaveToNotes(msg.content)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/70 hover:bg-white border border-[#0f3d3e]/10 text-[#0f3d3e]/80 hover:text-[#0f3d3e] transition-all shadow-soft"
                        title="Save this response as a note"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        <span>Save to Notes</span>
                      </button>

                      <button
                        onClick={() =>
                          onSendMessage(
                            `Please regenerate and refine your last answer:\n\n"${msg.content.slice(0, 50)}..."`
                          )
                        }
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
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 border border-[#0f3d3e]/10 shadow-soft text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-[#0F4C3A] animate-ping" />
                <span className="w-2 h-2 rounded-full bg-[#4B5563] animate-pulse" />
                <span>Thinking...</span>
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};


