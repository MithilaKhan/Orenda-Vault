'use client';

import React, { useEffect } from 'react';
import { Star, Clock, Trash2, Search, FileText } from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { Dashboard } from '@/features/home/Dashboard';
import { WorkspaceChat } from '@/features/chat/WorkspaceChat';
import { NotesManager } from '@/features/notes/NotesManager';
import { CollectionsManager } from '@/features/collections/CollectionsManager';
import { QuickNoteModal } from '@/features/notes/QuickNoteModal';

import { useWorkspaceData } from '@/hooks/useWorkspaceData';
import { useWorkspaceAI } from '@/hooks/useWorkspaceAI';
import { useWorkspaceViews } from '@/hooks/useWorkspaceViews';

export default function VaultPage() {
  const store = useWorkspaceStore();

  const {
    fetchData,
    handleAddNote,
    handleUpdateNote,
    handleDeleteNote,
    handleAddCollection,
    handleDeleteCollection,
    handleToggleFavorite,
    handleRestoreNote,
    handlePermanentlyDeleteNote
  } = useWorkspaceData(store);

  const {
    handleTriggerAITool,
    handleSendAI
  } = useWorkspaceAI(store);

  const {
    isQuickNoteOpen,
    setIsQuickNoteOpen,
    modalInitialTitle,
    modalInitialContent,
    handleOpenCapture,
    handleSearchSubmit,
    getDisplayedNotes
  } = useWorkspaceViews(store);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <WorkspaceShell
      activeView={store.activeView}
      onSelectView={(view) => {
        store.setActiveView(view);
        store.setSearchQuery('');
        store.setSelectedCollectionId(null);
      }}
      onNewWorkspace={() => handleOpenCapture('note')}
      onTriggerAITool={handleTriggerAITool}
      onSendFloatingAI={handleSendAI}
    >
      {/* Active Workspace Feature Rendering */}
      {store.activeView === 'dashboard' && (
        <Dashboard
          notes={store.notes}
          collections={store.collections}
          onSelectNote={(note) => {
            store.setSelectedNote(note);
            store.setActiveView('notes');
          }}
          onSelectCollection={(colId) => {
            store.setSelectedCollectionId(colId);
            store.setActiveView('collections');
          }}
          onActionCardClick={handleOpenCapture}
          onSearchSubmit={handleSearchSubmit}
          onQuickNoteCreate={() => handleOpenCapture('note')}
        />
      )}

      {store.activeView === 'chat' && (
        <WorkspaceChat
          messages={store.chatMessages}
          onSendMessage={handleSendAI}
          onSaveToNotes={(content, title) => {
            handleAddNote({
              title: title || 'AI Chat Snippet',
              content,
            });
          }}
          onClearHistory={store.clearChatHistory}
          isLoading={store.isAiLoading}
        />
      )}

      {(store.activeView === 'notes' ||
        store.activeView === 'favorites' ||
        store.activeView === 'recent' ||
        store.activeView === 'trash') && (
          <NotesManager
            notes={getDisplayedNotes()}
            collections={store.collections}
            onAddNote={handleAddNote as any}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onRestoreNote={handleRestoreNote}
            onPermanentlyDeleteNote={handlePermanentlyDeleteNote}
            onToggleFavorite={handleToggleFavorite}
            viewTitle={
              store.activeView === 'favorites'
                ? 'Favorite Notes'
                : store.activeView === 'recent'
                  ? 'Recent Notes'
                  : store.activeView === 'trash'
                    ? 'Trashed Notes'
                    : store.searchQuery
                      ? `Search Results for "${store.searchQuery}"`
                      : 'Vault Notes'
            }
            viewIcon={
              store.activeView === 'favorites' ? <Star className="w-5 h-5 text-[#0F4C3A] fill-[#0F4C3A]" /> :
                store.activeView === 'recent' ? <Clock className="w-5 h-5 text-[#0F4C3A] fill-[#0F4C3A]/20" /> :
                  store.activeView === 'trash' ? <Trash2 className="w-5 h-5 text-red-600 fill-red-500/20" /> :
                    store.searchQuery ? <Search className="w-5 h-5 text-[#0F4C3A]" /> :
                      <FileText className="w-5 h-5 text-[#0F4C3A] fill-[#0F4C3A]/20" />
            }
            viewDescription={
              store.activeView === 'favorites'
                ? 'Quickly access your starred notes and high-priority knowledge.'
                : store.activeView === 'recent'
                  ? 'Review your latest updated thoughts, captured snippets, and activity.'
                  : store.activeView === 'trash'
                    ? 'Items in trash can be restored or permanently removed.'
                    : store.searchQuery
                      ? 'Matching notes and snippets found across your vault.'
                      : 'Access, refine, and organize your entire knowledge repository.'
            }
            isTrashView={store.activeView === 'trash'}
          />
        )}

      {store.activeView === 'collections' && (
        <CollectionsManager
          collections={store.collections}
          notes={store.notes}
          onAddCollection={handleAddCollection as any}
          onDeleteCollection={handleDeleteCollection}
          onAddNote={handleAddNote as any}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          onToggleFavorite={handleToggleFavorite}
          selectedCollectionId={store.selectedCollectionId}
          onSelectCollection={store.setSelectedCollectionId}
        />
      )}

      {/* Instant Capture Modal */}
      <QuickNoteModal
        isOpen={isQuickNoteOpen}
        onClose={() => setIsQuickNoteOpen(false)}
        onSave={(noteData) => {
          handleAddNote(noteData);
        }}
        collections={store.collections}
        initialTitle={modalInitialTitle}
        initialContent={modalInitialContent}
      />
    </WorkspaceShell>
  );
}
