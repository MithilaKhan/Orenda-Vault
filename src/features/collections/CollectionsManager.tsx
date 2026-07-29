'use client';

import React, { useState } from 'react';
import { Collection, Note } from '@/types/workspace';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { NotesManager } from '@/features/notes/NotesManager';
import { Folder, Plus, ArrowLeft } from 'lucide-react';
import { CollectionCard } from '@/components/ui/CollectionCard';
import { NewCollectionModal } from '@/components/ui/NewCollectionModal';

export interface CollectionsManagerProps {
  collections: Collection[];
  notes: Note[];
  onAddCollection: (name: string, description?: string, icon?: string) => void;
  onDeleteCollection: (id: string) => void;
  onAddNote: (note: { title: string; content: string; tags?: string[]; collectionId?: string }) => void;
  onUpdateNote: (id: string, partial: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  selectedCollectionId: string | null;
  onSelectCollection: (id: string | null) => void;
}

export const CollectionsManager: React.FC<CollectionsManagerProps> = ({
  collections,
  notes,
  onAddCollection,
  onDeleteCollection,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onToggleFavorite,
  selectedCollectionId,
  onSelectCollection,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // If a collection is selected, render its notes!
  if (selectedCollectionId) {
    const activeCol = collections.find(c => c.id === selectedCollectionId);
    const colNotes = notes.filter(n => n.collectionId === selectedCollectionId && !n.isTrashed);

    return (
      <div className="space-y-6">
        <button
          onClick={() => onSelectCollection(null)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#4B5563] hover:text-[#0f3d3e] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all Collections
        </button>

        <NotesManager
          notes={colNotes}
          collections={collections}
          onAddNote={(data) => onAddNote({ ...data, collectionId: selectedCollectionId })}
          onUpdateNote={onUpdateNote}
          onDeleteNote={onDeleteNote}
          onToggleFavorite={onToggleFavorite}
          viewTitle={activeCol ? activeCol.name : 'Collection Notes'}
          viewIcon={<Folder className="w-6 h-6 text-[#0F4C3A]" />}
          viewDescription={activeCol?.description || 'Notes saved inside this collection'}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      <PageHeader
        title="Collections"
        description="Organize your knowledge into dedicated project vaults and topics"
        icon={<Folder className="w-6 h-6 text-[#0F4C3A]" />}
        action={
          <Button variant="accent" size="sm" onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4 font-semibold" />}>
            New Collection
          </Button>
        }
      />

      {collections.length === 0 ? (
        <EmptyState
          title="No collections yet."
          description="Create a collection to organize your notes."
          onCreateNote={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((col) => {
            const count = notes.filter(n => n.collectionId === col.id && !n.isTrashed).length;
            return (
              <CollectionCard
                key={col.id}
                collection={col}
                noteCount={count}
                onSelect={onSelectCollection}
                onDelete={onDeleteCollection}
              />
            );
          })}
        </div>
      )}

      <NewCollectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(name, desc, icon) => onAddCollection(name, desc, icon)}
      />
    </div>
  );
};
