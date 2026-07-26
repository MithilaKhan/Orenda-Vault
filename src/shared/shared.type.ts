export type WorkspaceView = 
  | 'dashboard' 
  | 'chat' 
  | 'notes' 
  | 'collections' 
  | 'favorites' 
  | 'recent' 
  | 'trash';

export type ActionType = 'note' | 'website' | 'pdf' | 'code' | 'idea' | 'meeting';

export interface ActionCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  actionType: ActionType;
}

export interface ActivityItem {
  id: string;
  title: string;
  type: string;
  tag: string;
  timestamp: number;
  targetId?: string;
}

export interface WorkspaceChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isFavorite?: boolean;
}
