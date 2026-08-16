'use client';

import React from 'react';
import { WorkspaceChat } from '@/features/chat/WorkspaceChat';
import { useWorkspace } from '@/context/WorkspaceContext';

export default function ChatPage() {
  const { store, data, ai } = useWorkspace();

  return (
    <WorkspaceChat
      messages={store.chatMessages}
      onSendMessage={ai.handleSendAI}
      onSaveToNotes={(content, title) => {
        data.handleAddNote({
          title: title || 'AI Chat Snippet',
          content,
        });
      }}
      onClearHistory={store.clearChatHistory}
      isLoading={store.isAiLoading}
    />
  );
}
