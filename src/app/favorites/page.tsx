'use client';

import React from 'react';
import { NotesManager } from '@/features/notes/NotesManager';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Star } from 'lucide-react';

export default function FavoritesPage() {
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
      viewTitle="Favorite Notes"
      viewIcon={<Star className="w-5 h-5 text-[#0F4C3A] fill-[#0F4C3A]" />}
      viewDescription="Quickly access your starred notes and high-priority knowledge."
      isTrashView={false}
      isFavoritesView={true}
    />
  );
}
