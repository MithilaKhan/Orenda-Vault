import { WorkspaceView } from '@/types/workspace';

export interface NavItem {
  id: WorkspaceView;
  label: string;
  iconName: string;
  badge?: string;
}

export interface AIToolItem {
  id: string;
  label: string;
  iconName: string;
  prompt: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', iconName: 'Home' },
  { id: 'notes', label: 'Notes', iconName: 'FileText' },
  { id: 'collections', label: 'Collections', iconName: 'Folder' },
  { id: 'favorites', label: 'Favorites', iconName: 'Star' },
  { id: 'recent', label: 'Recent Activity', iconName: 'Clock' },
  { id: 'trash', label: 'Trash', iconName: 'Trash2' },
];

export const AI_TOOLS: AIToolItem[] = [
  { 
    id: 'chat', 
    label: 'AI Search', 
    iconName: 'Sparkles', 
    prompt: '' 
  },

  { 
    id: 'search', 
    label: 'Smart Search', 
    iconName: 'Search', 
    prompt: 'Search across all my notes and collections for insights.' 
  },
];
