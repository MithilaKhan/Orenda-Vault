'use client';

import React, { useState } from 'react';
import { WorkspaceChat } from '@/features/chat/WorkspaceChat';
import { useWorkspace } from '@/context/WorkspaceContext';
import { ChatInputBox } from '@/components/ui/ChatInputBox';

export default function ChatPage() {
  const { store, data, ai } = useWorkspace();
  const [prompt, setPrompt] = useState('');

  const handleSend = () => {
    if (!prompt.trim() || store.isAiLoading) return;
    ai.handleSendAI(prompt.trim());
    setPrompt('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6">
        <WorkspaceChat
          messages={store.chatMessages}
          onSendMessage={(msg) => ai.handleSendAI(msg)}
          onSaveToNotes={(content, title) => {
            data.handleAddNote({
              title: title || 'AI Chat Snippet',
              content,
            });
          }}
          onClearHistory={ai.handleClearHistory}
          isLoading={store.isAiLoading}
          isHistoryLoading={store.isHistoryLoading}
        />
      </div>

      {/* Sticky input at bottom */}
      <ChatInputBox
        prompt={prompt}
        setPrompt={setPrompt}
        onGenerate={handleSend}
        loading={store.isAiLoading}
      />
    </div>
  );
}

