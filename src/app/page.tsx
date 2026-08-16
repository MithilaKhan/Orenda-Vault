'use client';

import React from 'react';
import { Dashboard } from '@/features/home/Dashboard';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { store, views } = useWorkspace();
  const router = useRouter();

  return (
    <Dashboard
      notes={store.notes}
      collections={store.collections}
      onSelectNote={(note) => {
        store.setSelectedNote(note);
        router.push('/notes');
      }}
      onSelectCollection={(colId) => {
        store.setSelectedCollectionId(colId);
        router.push('/collections');
      }}
      onActionCardClick={views.handleOpenCapture}
      onSearchSubmit={views.handleSearchSubmit}
      onQuickNoteCreate={() => views.handleOpenCapture('note')}
    />
  );
}
