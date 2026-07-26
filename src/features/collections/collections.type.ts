import { Note } from '@/features/notes/notes.type';

export interface Collection {
  id: string;
  name: string;
  icon: string;
  description?: string;
  noteCount: number;
  createdAt: number;
}

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
