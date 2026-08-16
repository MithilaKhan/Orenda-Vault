'use client';

import React from 'react';
import { WorkspaceProvider, useWorkspace } from '@/context/WorkspaceContext';
import { WorkspaceShell } from './WorkspaceShell';
import { QuickNoteModal } from '@/features/notes/QuickNoteModal';
import { useRouter } from 'next/navigation';

function WorkspaceLayoutContent({ children }: { children: React.ReactNode }) {
  const { store, data, ai, views } = useWorkspace();
  const router = useRouter();

  return (
    <>
      <WorkspaceShell
        user={store.user}
        setUser={store.setUser}
        activeView={store.activeView}
        onSelectView={(view) => {
          router.push(view === 'dashboard' ? '/' : `/${view}`);
          store.setSearchQuery('');
          if (view !== 'collections') {
            store.setSelectedCollectionId(null);
          }
        }}
        onNewWorkspace={() => views.handleOpenCapture('note')}
        onTriggerAITool={ai.handleTriggerAITool}
        onSendFloatingAI={ai.handleSendAI}
      >
        {children}
      </WorkspaceShell>
      <QuickNoteModal
        isOpen={views.isQuickNoteOpen}
        onClose={() => views.setIsQuickNoteOpen(false)}
        onSave={data.handleAddNote}
        collections={store.collections}
        initialTitle={views.modalInitialTitle}
        initialContent={views.modalInitialContent}
      />
    </>
  );
}

export const WorkspaceLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WorkspaceProvider>
      <WorkspaceLayoutContent>{children}</WorkspaceLayoutContent>
    </WorkspaceProvider>
  );
};
