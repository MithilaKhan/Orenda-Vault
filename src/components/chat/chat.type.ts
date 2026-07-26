import { Message } from '@/hooks/hooks.type';

export interface ChatWindowProps {
  messages?: Message[];
  onSendMessage?: (content: string) => void;
  isLoading?: boolean;
}
