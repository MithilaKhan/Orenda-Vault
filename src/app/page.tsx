'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Clock, Trash2, Search, FileText } from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { Dashboard } from '@/features/home/Dashboard';
import { WorkspaceChat } from '@/features/chat/WorkspaceChat';
import { NotesManager } from '@/features/notes/NotesManager';
import { CollectionsManager } from '@/features/collections/CollectionsManager';
import { QuickNoteModal } from '@/features/notes/QuickNoteModal';
import { aiService } from '@/services/aiService';
import { ActionType } from '@/types/workspace';

export default function VaultPage() {
  const store = useWorkspaceStore();
  const [isQuickNoteOpen, setIsQuickNoteOpen] = useState<boolean>(false);
  const [modalInitialTitle, setModalInitialTitle] = useState<string>('');
  const [modalInitialContent, setModalInitialContent] = useState<string>('');

  const handleOpenCapture = (actionType: ActionType) => {
    switch (actionType) {
      case 'note':
        setModalInitialTitle('New Quick Note');
        setModalInitialContent('');
        break;
      case 'website':
        setModalInitialTitle('Saved Website Bookmark');
        setModalInitialContent('### URL:\nhttps://example.com\n\n### AI Summary:\n- Key takeaway 1\n- Key takeaway 2');
        break;
      case 'pdf':
        setModalInitialTitle('PDF Document Summary');
        setModalInitialContent('### Document Name:\nProject_Specification.pdf\n\n### Extracted Takeaways:\n1. Architecture goals\n2. Design system tokens');
        break;
      case 'code':
        setModalInitialTitle('TypeScript Snippet');
        setModalInitialContent('```ts\n// Paste code here\nconst vault = new OrendaVault();\n```\n\n### Notes:\nWhy this pattern was used.');
        break;
      case 'idea':
        setModalInitialTitle('Brainstorming Concept');
        setModalInitialContent('### Problem Statement:\n...\n\n### Proposed Solution:\n...');
        break;
      case 'meeting':
        setModalInitialTitle('Meeting Notes: Standup');
        setModalInitialContent('### Attendees:\n- Mithila\n- Team\n\n### Action Items:\n- [ ] Finalize Orenda Vault layout\n- [ ] Deploy to Vercel');
        break;
    }
    setIsQuickNoteOpen(true);
  };

  const handleTriggerAITool = async (toolId: string, prompt: string) => {
    store.setActiveView('chat');
    store.addChatMessage({ role: 'user', content: `Tool Action: **${toolId.toUpperCase()}**\n\n${prompt}` });
    store.setIsAiLoading(true);

    try {
      const res = await aiService.generateResponse(prompt, store.chatMessages);
      store.addChatMessage({ role: 'assistant', content: res.content });
    } catch {
      store.addChatMessage({ role: 'assistant', content: 'I encountered an error executing this tool, but local fallback memory is active.' });
    } finally {
      store.setIsAiLoading(false);
    }
  };

  const handleSendAI = async (prompt: string) => {
    store.setActiveView('chat');
    store.addChatMessage({ role: 'user', content: prompt });
    store.setIsAiLoading(true);

    try {
      const res = await aiService.generateResponse(prompt, store.chatMessages);
      store.addChatMessage({ role: 'assistant', content: res.content });
    } catch {
      store.addChatMessage({ role: 'assistant', content: aiService.getOfflineFallback(prompt) });
    } finally {
      store.setIsAiLoading(false);
    }
  };

  const handleSearchSubmit = (query: string) => {
    store.setSearchQuery(query);
    if (!query.trim()) {
      store.setActiveView('notes');
      return;
    }
    store.setActiveView('notes');
  };

  const getDisplayedNotes = () => {
    let filtered = store.notes;

    if (store.activeView === 'favorites') {
      filtered = filtered.filter(n => n.isFavorite && !n.isTrashed);
    } else if (store.activeView === 'trash') {
      filtered = filtered.filter(n => n.isTrashed);
    } else if (store.activeView === 'recent') {
      filtered = [...filtered.filter(n => !n.isTrashed)].sort((a, b) => b.updatedAt - a.updatedAt);
    } else {
      filtered = filtered.filter(n => !n.isTrashed);
    }

    if (store.searchQuery.trim()) {
      const q = store.searchQuery.toLowerCase();
      filtered = filtered.filter(
        n => n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          (n.category && n.category.toLowerCase().includes(q))
      );
    }

    return filtered;
  };

  if (!store.isHydrated) {
    return (
      <div className="min-h-screen bg-[#F7F3EA] flex flex-col items-center justify-center p-6 text-[#0f3d3e] animate-in fade-in duration-300">
        <div className="relative w-20 h-20 flex items-center justify-center mb-6">
          <div className="absolute inset-0 border-4 border-[#0f3d3e]/10 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-[#0F4C3A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          <span className="inline-flex items-center justify-center overflow-hidden rounded-full animate-pulse" style={{ width: 48, height: 48 }}>
            <Image
              src="/logo-mockup.png"
              alt="Orenda Vault"
              width={76}
              height={76}
              style={{ objectFit: 'cover', width: 76, height: 76 }}
              priority
            />
          </span>
        </div>
        <p className="text-xs font-semibold tracking-widest text-[#0f3d3e]/80 uppercase animate-pulse">
          Loading Orenda Vault...
        </p>
      </div>
    );
  }

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
          activities={store.activities}
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
            store.addNote({
              title: title || 'AI Chat Snippet',
              content,
              summary: content.slice(0, 100) + '...',
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
            onAddNote={store.addNote}
            onUpdateNote={store.updateNote}
            onDeleteNote={store.deleteNote}
            onRestoreNote={store.restoreNote}
            onPermanentlyDeleteNote={store.permanentlyDeleteNote}
            onToggleFavorite={store.toggleFavorite}
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
          onAddCollection={store.addCollection}
          onDeleteCollection={store.deleteCollection}
          onAddNote={store.addNote}
          onUpdateNote={store.updateNote}
          onDeleteNote={store.deleteNote}
          onToggleFavorite={store.toggleFavorite}
          selectedCollectionId={store.selectedCollectionId}
          onSelectCollection={store.setSelectedCollectionId}
        />
      )}

      {/* Instant Capture Modal */}
      <QuickNoteModal
        isOpen={isQuickNoteOpen}
        onClose={() => setIsQuickNoteOpen(false)}
        onSave={(noteData) => {
          store.addNote(noteData);
        }}
        collections={store.collections}
        initialTitle={modalInitialTitle}
        initialContent={modalInitialContent}
      />
    </WorkspaceShell>
  );
}
