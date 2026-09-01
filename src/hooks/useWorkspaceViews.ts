import { useState } from 'react';
import { WorkspaceStore } from '@/store/useWorkspaceStore';
import { ActionType } from '@/types/workspace';

export const useWorkspaceViews = (store: WorkspaceStore) => {
  const [isQuickNoteOpen, setIsQuickNoteOpen] = useState<boolean>(false);
  const [isCodeSnippetOpen, setIsCodeSnippetOpen] = useState<boolean>(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState<boolean>(false);
  const [isSummarizeModalOpen, setIsSummarizeModalOpen] = useState<boolean>(false);
  const [modalInitialTitle, setModalInitialTitle] = useState<string>('');
  const [modalInitialContent, setModalInitialContent] = useState<string>('');

  const handleOpenCapture = (actionType: ActionType) => {
    switch (actionType) {
      case 'note':
        setModalInitialTitle('');
        setModalInitialContent('');
        setIsQuickNoteOpen(true);
        break;
      case 'code':
        setIsCodeSnippetOpen(true);
        break;
      case 'collection':
        setIsCollectionModalOpen(true);
        break;
      case 'summarize':
        setIsSummarizeModalOpen(true);
        break;
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
    isCodeSnippetOpen,
    setIsCodeSnippetOpen,
    isCollectionModalOpen,
    setIsCollectionModalOpen,
    isSummarizeModalOpen,
    setIsSummarizeModalOpen,
    modalInitialTitle,
    modalInitialContent,
    handleOpenCapture,
    handleSearchSubmit,
    getDisplayedNotes
  };
};
