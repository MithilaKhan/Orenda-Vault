import { ReactNode } from 'react';
import { Note, Collection, WorkspaceView } from '@/types/workspace';

export type CommandItemCategory = 'actions' | 'notes' | 'collections';

export interface CommandPaletteItemData {
  id: string;
  category: CommandItemCategory;
  title: string;
  subtitle?: string;
  badge?: string;
  icon: ReactNode;
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  notes: Note[];
  collections: Collection[];
  onSelectView: (view: WorkspaceView) => void;
  onSelectNote?: (note: Note) => void;
  onSelectCollection?: (collectionId: string) => void;
  onNewNote?: () => void;
}
