'use client';

import React from 'react';
import { CollectionsManager } from '@/features/collections/CollectionsManager';
import { useWorkspace } from '@/context/WorkspaceContext';

export default function CollectionsPage() {
  const { store, data } = useWorkspace();

  return (
    <CollectionsManager
      collections={store.collections}
      notes={store.notes}
      onAddCollection={data.handleAddCollection as any}
      onDeleteCollection={data.handleDeleteCollection}
      onAddNote={data.handleAddNote as any}
      onUpdateNote={data.handleUpdateNote}
      onDeleteNote={data.handleDeleteNote}
      onToggleFavorite={data.handleToggleFavorite}
      selectedCollectionId={store.selectedCollectionId}
      onSelectCollection={store.setSelectedCollectionId}
    />
  );
}
