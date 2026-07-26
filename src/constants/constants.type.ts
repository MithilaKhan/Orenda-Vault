import { ActionType } from '@/shared/shared.type';

export interface QuickActionCardConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  actionType: ActionType;
}

export interface AIToolConfig {
  id: string;
  label: string;
  iconName: string;
  prompt: string;
}

export interface MainNavItemConfig {
  id: any;
  label: string;
  iconName: string;
}
