import { WorkspaceView, ActivityItem, WorkspaceChatMessage } from '@/shared/shared.type';
import { Note } from '@/features/notes/notes.type';
import { Collection } from '@/features/collections/collections.type';

export interface WorkspaceStoreState {
  activeView: WorkspaceView;
  notes: Note[];
  collections: Collection[];
  activities: ActivityItem[];
  chatMessages: WorkspaceChatMessage[];
  searchQuery: string;
  selectedNote: Note | null;
  selectedCollectionId: string | null;
  isAiLoading: boolean;
  isHydrated: boolean;
}

export interface WorkspaceStoreActions {
  setActiveView: (view: WorkspaceView) => void;
  setSearchQuery: (query: string) => void;
  setSelectedNote: (note: Note | null) => void;
  setSelectedCollectionId: (id: string | null) => void;
  addNote: (noteData: {
    title: string;
    content: string;
    summary?: string;
    category?: string;
    collectionId?: string;
  }) => Note;
  updateNote: (id: string, partial: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addCollection: (name: string, description?: string, icon?: string) => Collection;
  deleteCollection: (id: string) => void;
  addChatMessage: (role: 'user' | 'assistant' | 'system', content: string) => WorkspaceChatMessage;
  clearChatHistory: () => void;
  addActivity: (title: string, type: string, targetId?: string) => void;
  triggerAITool: (toolId: string, prompt: string) => Promise<void>;
  resetToDefault: () => void;
}
