'use client';

import React from 'react';
import { NotesManager } from '@/features/notes/NotesManager';
import { useWorkspace } from '@/context/WorkspaceContext';

export default function NotesPage() {
  const { store, data, views } = useWorkspace();

  return (
    <NotesManager
      notes={views.getDisplayedNotes()}
      collections={store.collections}
      onAddNote={data.handleAddNote as any}
      onUpdateNote={data.handleUpdateNote}
      onDeleteNote={data.handleDeleteNote}
      onRestoreNote={data.handleRestoreNote}
      onPermanentlyDeleteNote={data.handlePermanentlyDeleteNote}
      onToggleFavorite={data.handleToggleFavorite}
      viewTitle={store.searchQuery ? `Search Results for "${store.searchQuery}"` : 'Vault Notes'}
      isTrashView={false}
      isFavoritesView={false}
    />
  );
}
