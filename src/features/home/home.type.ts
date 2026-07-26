import { ActivityItem, ActionType } from '@/shared/shared.type';
import { Note } from '@/features/notes/notes.type';
import { Collection } from '@/features/collections/collections.type';

export interface DashboardProps {
  notes: Note[];
  collections: Collection[];
  activities: ActivityItem[];
  onSelectNote: (note: Note) => void;
  onSelectCollection: (colId: string) => void;
  onActionCardClick: (actionType: ActionType) => void;
  onSearchSubmit: (query: string) => void;
  onQuickNoteCreate: () => void;
}
