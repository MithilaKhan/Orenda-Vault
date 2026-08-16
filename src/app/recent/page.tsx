'use client';

import React from 'react';
import { NotesManager } from '@/features/notes/NotesManager';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Clock } from 'lucide-react';

export default function RecentPage() {
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
      viewTitle="Recent Notes"
      viewIcon={<Clock className="w-5 h-5 text-[#0F4C3A] fill-[#0F4C3A]/20" />}
      viewDescription="Review your latest updated thoughts, captured snippets, and activity."
      isTrashView={false}
      isFavoritesView={false}
    />
  );
}
