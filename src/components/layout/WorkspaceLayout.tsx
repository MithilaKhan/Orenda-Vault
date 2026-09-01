'use client';

import React from 'react';
import { WorkspaceProvider, useWorkspace } from '@/context/WorkspaceContext';
import { WorkspaceShell } from './WorkspaceShell';
import { QuickNoteModal } from '@/features/notes/QuickNoteModal';
import { CodeSnippetModal } from '@/components/ui/CodeSnippetModal';
import { NewCollectionModal } from '@/components/ui/NewCollectionModal';
import { SummarizeModal } from '@/components/ui/SummarizeModal';
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
        notes={store.notes}
        collections={store.collections}
        isPaletteOpen={store.isCommandPaletteOpen}
        paletteInitialQuery={store.paletteInitialQuery}
        onOpenPalette={store.openCommandPalette}
        onClosePalette={store.closeCommandPalette}
        isAuthModalOpen={store.isAuthModalOpen}
        setIsAuthModalOpen={store.setIsAuthModalOpen}
        onLogout={data.handleLogout}
        onSelectView={(view) => {
          router.push(view === 'dashboard' ? '/' : `/${view}`);
          store.setSearchQuery('');
          if (view !== 'collections') {
            store.setSelectedCollectionId(null);
          }
        }}
        onSelectNote={(note) => {
          store.setSelectedNote(note);
          store.setSearchQuery(note.title);
          router.push('/notes');
        }}
        onSelectCollection={(collectionId) => {
          store.setSelectedCollectionId(collectionId);
          router.push('/collections');
        }}
        onNewWorkspace={() => {
          if (!store.user) {
            store.setIsAuthModalOpen(true);
            return;
          }
          views.handleOpenCapture('note');
        }}
        onTriggerAITool={ai.handleTriggerAITool}
        onSendFloatingAI={ai.handleSendAI}
      >
        {children}
      </WorkspaceShell>

      {/* Quick Note Modal */}
      <QuickNoteModal
        isOpen={views.isQuickNoteOpen}
        onClose={() => views.setIsQuickNoteOpen(false)}
        onSave={async (noteData) => {
          const success = await data.handleAddNote(noteData);
          if (success) {
            store.setActiveView('notes');
            router.push('/notes');
          }
        }}
        collections={store.collections}
        initialTitle={views.modalInitialTitle}
        initialContent={views.modalInitialContent}
      />

      {/* Code Snippet Modal */}
      <CodeSnippetModal
        isOpen={views.isCodeSnippetOpen}
        onClose={() => views.setIsCodeSnippetOpen(false)}
        onSave={async (noteData) => {
          const success = await data.handleAddNote(noteData);
          if (success) {
            store.setActiveView('notes');
            router.push('/notes');
          }
        }}
        collections={store.collections}
      />

      {/* New Collection Modal (from dashboard) */}
      <NewCollectionModal
        isOpen={views.isCollectionModalOpen}
        onClose={() => views.setIsCollectionModalOpen(false)}
        onCreate={async (name, desc, icon) => {
          const success = await data.handleAddCollection(name, desc || '', icon || 'Folder');
          if (success) {
            store.setActiveView('collections');
            router.push('/collections');
          }
        }}
      />

      {/* AI Summarize Modal */}
      <SummarizeModal
        isOpen={views.isSummarizeModalOpen}
        onClose={() => views.setIsSummarizeModalOpen(false)}
        onSaveAsNote={async (noteData) => {
          const success = await data.handleAddNote(noteData);
          if (success) {
            store.setActiveView('notes');
            router.push('/notes');
          }
        }}
      />
    </>
  );
}

export const WorkspaceLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <WorkspaceProvider>
      <WorkspaceLayoutContent>{children}</WorkspaceLayoutContent>
    </WorkspaceProvider>
  );
};

