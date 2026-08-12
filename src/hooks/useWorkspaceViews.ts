import { useState } from 'react';
import { WorkspaceStore } from '@/store/useWorkspaceStore';
import { ActionType } from '@/types/workspace';

export const useWorkspaceViews = (store: WorkspaceStore) => {
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

  return {
    isQuickNoteOpen,
    setIsQuickNoteOpen,
    modalInitialTitle,
    modalInitialContent,
    handleOpenCapture,
    handleSearchSubmit,
    getDisplayedNotes
  };
};
