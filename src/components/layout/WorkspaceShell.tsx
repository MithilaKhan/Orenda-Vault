'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { BottomCommandBar } from './BottomCommandBar';
import { AuthModal } from '../../features/auth/AuthModal';
import { ProfileSettingsModal } from '../../features/settings/ProfileSettingsModal';
import { CommandPaletteModal } from '../ui/command-palette/CommandPaletteModal';
import { WorkspaceView, User, Note, Collection } from '@/types/workspace';
import { useProfile } from '@/hooks/useProfile';
import { getCookieValue } from '@/helpers/cookieHelper';

export interface WorkspaceShellProps {
  user: User | null;
  setUser: (user: User | null) => void;
  activeView: WorkspaceView;
  notes?: Note[];
  collections?: Collection[];
  isPaletteOpen?: boolean;
  paletteInitialQuery?: string;
  onOpenPalette?: (query?: string) => void;
  onClosePalette?: () => void;
  onSelectView: (view: WorkspaceView) => void;
  onNewWorkspace: () => void;
  onTriggerAITool: (toolId: string, prompt: string) => void;
  onSendFloatingAI: (prompt: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  onLogout: () => void;
  onSelectNote?: (note: Note) => void;
  onSelectCollection?: (collectionId: string) => void;
  children: React.ReactNode;
}

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({
  user,
  setUser,
  activeView,
  notes = [],
  collections = [],
  isPaletteOpen = false,
  paletteInitialQuery = '',
  onOpenPalette,
  onClosePalette,
  onSelectView,
  onNewWorkspace,
  onTriggerAITool,
  onSendFloatingAI,
  isAuthModalOpen,
  setIsAuthModalOpen,
  onLogout,
  onSelectNote,
  onSelectCollection,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [floatingPrompt, setFloatingPrompt] = useState('');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isPaletteOpen) {
          onClosePalette?.();
        } else {
          onOpenPalette?.('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaletteOpen, onOpenPalette, onClosePalette]);

  const { getProfile } = useProfile();

  const fetchUser = useCallback(async () => {
    const token = getCookieValue('accessToken');
    if (token) {
      const res = await getProfile();
      if (res?.success && res.data) {
        setUser(res.data);
      }
    }
  }, [getProfile, setUser]);

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#0f3d3e] flex flex-col font-sans relative">
      <MobileHeader
        onSelectView={onSelectView}
        isMobileOpen={isMobileOpen}
        onToggleMobileOpen={() => setIsMobileOpen(!isMobileOpen)}
        activeView={activeView}
        onNewWorkspace={onNewWorkspace}
        onTriggerAITool={onTriggerAITool}
      />

      <div className="hidden lg:block">
        <Sidebar
          user={user}
          activeView={activeView}
          onSelectView={onSelectView}
          onNewWorkspace={onNewWorkspace}
          onTriggerAITool={onTriggerAITool}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onLogout={onLogout}
        />
      </div>

      <main
        className={`flex-1 transition-all duration-300 ${
          activeView === 'chat' ? '' : 'pb-28'
        } ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <div className={activeView === 'chat' ? 'h-full' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8'}>
          {children}
        </div>
      </main>

      {/* Hide bottom floating search bar on homepage/dashboard and chat */}
      {activeView !== 'dashboard' && activeView !== 'chat' && (
        <BottomCommandBar
          isCollapsed={isCollapsed}
          onOpenPalette={() => onOpenPalette?.('')}
          floatingPrompt={floatingPrompt}
          setFloatingPrompt={setFloatingPrompt}
          onSubmit={(e) => {
            e.preventDefault();
            onOpenPalette?.(floatingPrompt);
          }}
        />
      )}

      <CommandPaletteModal
        isOpen={isPaletteOpen}
        initialQuery={paletteInitialQuery}
        onClose={() => onClosePalette?.()}
        notes={notes}
        collections={collections}
        onSelectView={onSelectView}
        onSelectNote={onSelectNote}
        onSelectCollection={onSelectCollection}
        onNewNote={onNewWorkspace}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={fetchUser}
      />
      <ProfileSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        user={user}
        setUser={setUser}
      />
    </div>
  );
};
