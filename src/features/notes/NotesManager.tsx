'use client';

import React, { useState } from 'react';
import { Note, Collection } from '@/types/workspace';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { FileText } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { Radio, ConfigProvider } from 'antd';
import { NoteCard } from '@/components/ui/NoteCard';
import { NoteEditorModal } from '@/components/ui/NoteEditorModal';
import { NoteTableView } from '@/components/ui/NoteTableView';

export interface NotesManagerProps {
  notes: Note[];
  collections: Collection[];
  onAddNote: (note: { title: string; content: string; tags?: string[]; collectionId?: string }) => void;
  onUpdateNote: (id: string, partial: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  onRestoreNote?: (id: string) => void;
  onPermanentlyDeleteNote?: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  viewTitle?: string;
  viewIcon?: React.ReactNode;
  viewDescription?: string;
  isTrashView?: boolean;
}

export const NotesManager: React.FC<NotesManagerProps> = ({
  notes,
  collections,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onRestoreNote,
  onPermanentlyDeleteNote,
  onToggleFavorite,
  viewTitle = 'Vault Notes',
  viewIcon = <FileText className="w-5 h-5 text-[#0F4C3A] fill-[#0F4C3A]/20" />,
  viewDescription = 'Access, refine, and organize your entire knowledge repository.',
  isTrashView = false,
}) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAiSummarizing, setIsAiSummarizing] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const handleOpenEdit = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(true);
  };

  const handleAiSummarize = async (note: Note) => {
    setIsAiSummarizing(true);
    try {
      const summary = await aiService.summarizeText(note.content);
      onUpdateNote(note.id, { summary });
    } catch {
      // ignore
    } finally {
      setIsAiSummarizing(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0F4C3A',
          colorText: '#0f3d3e',
          colorTextSecondary: '#4B5563',
          borderRadius: 12,
        },
      }}
    >
      <div className="space-y-6 pb-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <PageHeader
            title={viewTitle}
            description={viewDescription}
            icon={viewIcon || <FileText className="w-6 h-6 text-[#0F4C3A]" />}
          />
          {notes.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Radio.Group
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="grid">Grid View</Radio.Button>
                <Radio.Button value="table">Table View</Radio.Button>
              </Radio.Group>
            </div>
          )}
        </div>

        {notes.length === 0 ? (
          <EmptyState 
            title={isTrashView ? 'Trash is empty' : 'No notes yet.'}
            description={isTrashView ? 'Deleted notes will appear here.' : 'Create your first note to start building your knowledge library.'}
            onCreateNote={isTrashView ? undefined : () => onAddNote({ title: 'New Vault Note', content: '# Welcome\n\nStart writing...' })}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map((note) => {
              const col = collections.find(c => c.id === note.collectionId);
              return (
                <NoteCard
                  key={note.id}
                  note={note}
                  collection={col}
                  isTrashView={isTrashView}
                  onFavorite={onToggleFavorite}
                  onEdit={handleOpenEdit}
                  onDelete={onDeleteNote}
                  onRestore={onRestoreNote}
                  onPermanentlyDelete={onPermanentlyDeleteNote}
                  onAiSummarize={handleAiSummarize}
                  isAiSummarizing={isAiSummarizing}
                />
              );
            })}
          </div>
        ) : (
          <NoteTableView
            notes={notes}
            collections={collections}
            isTrashView={isTrashView}
            onOpenEdit={handleOpenEdit}
            onToggleFavorite={onToggleFavorite}
            onDeleteNote={onDeleteNote}
            onRestoreNote={onRestoreNote}
            onPermanentlyDeleteNote={onPermanentlyDeleteNote}
          />
        )}

        <NoteEditorModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          note={selectedNote}
          onSave={onUpdateNote}
        />
      </div>
    </ConfigProvider>
  );
};
