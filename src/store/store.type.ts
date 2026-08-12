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
}

export interface WorkspaceStoreActions {
  setActiveView: (view: WorkspaceView) => void;
  setSearchQuery: (query: string) => void;
  setSelectedNote: (note: Note | null) => void;
  setSelectedCollectionId: (id: string | null) => void;
  setNotes: (notes: Note[]) => void;
  setCollections: (collections: Collection[]) => void;
  addChatMessage: (role: 'user' | 'assistant' | 'system', content: string) => WorkspaceChatMessage;
  clearChatHistory: () => void;
  addActivity: (title: string, type: string, targetId?: string) => void;
  triggerAITool: (toolId: string, prompt: string) => Promise<void>;
  resetToDefault: () => void;
}
