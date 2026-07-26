import { Collection } from '@/features/collections/collections.type';

export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  category?: string;
  collectionId?: string;
  isFavorite: boolean;
  isTrashed: boolean;
  createdAt: number;
  updatedAt: number;
}

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
  viewDescription?: string;
  isTrashView?: boolean;
}

export interface QuickNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: {
    title: string;
    content: string;
    tags?: string[];
    category?: string;
    collectionId?: string;
  }) => void;
  collections: Collection[];
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
}
