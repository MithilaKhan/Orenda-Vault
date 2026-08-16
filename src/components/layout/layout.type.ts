import React from 'react';
import { WorkspaceView, ActionType, User } from '@/shared/shared.type';

export interface SidebarProps {
  user: User | null;
  activeView: WorkspaceView;
  onSelectView: (view: WorkspaceView) => void;
  onNewWorkspace: () => void;
  onTriggerAITool: (toolId: string, prompt: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenAuth: () => void;
  onOpenSettings: () => void;
}

export interface WorkspaceShellProps {
  children: React.ReactNode;
  activeView: WorkspaceView;
  onSelectView: (view: WorkspaceView) => void;
  onTriggerAITool: (toolId: string, prompt: string) => void;
  onQuickNoteCreate: () => void;
}