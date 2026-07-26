import { WorkspaceChatMessage } from '@/shared/shared.type';

export interface WorkspaceChatProps {
  messages: WorkspaceChatMessage[];
  onSendMessage: (prompt: string) => void;
  onSaveToNotes: (content: string, title?: string) => void;
  onClearHistory: () => void;
  isLoading: boolean;
}
