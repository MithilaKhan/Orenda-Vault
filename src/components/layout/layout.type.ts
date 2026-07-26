import React from 'react';
import { WorkspaceView, ActionType } from '@/shared/shared.type';

export interface SidebarProps {
  activeView: WorkspaceView;
  onSelectView: (view: WorkspaceView) => void;
  onTriggerAITool: (toolId: string, prompt: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export interface WorkspaceShellProps {
  children: React.ReactNode;
  activeView: WorkspaceView;
  onSelectView: (view: WorkspaceView) => void;
  onTriggerAITool: (toolId: string, prompt: string) => void;
  onQuickNoteCreate: () => void;
}
