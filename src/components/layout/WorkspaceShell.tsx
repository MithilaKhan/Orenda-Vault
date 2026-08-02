'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { AuthModal } from '../../features/auth/AuthModal';
import { ProfileSettingsModal } from '../../features/settings/ProfileSettingsModal';
import { WorkspaceView } from '@/types/workspace';
import { Sparkles, Send, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';

export interface WorkspaceShellProps {
  activeView: WorkspaceView;
  onSelectView: (view: WorkspaceView) => void;
  onNewWorkspace: () => void;
  onTriggerAITool: (toolId: string, prompt: string) => void;
  onSendFloatingAI: (prompt: string) => void;
  children: React.ReactNode;
}

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({
  activeView,
  onSelectView,
  onNewWorkspace,
  onTriggerAITool,
  onSendFloatingAI,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [floatingPrompt, setFloatingPrompt] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleFloatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!floatingPrompt.trim()) return;
    onSendFloatingAI(floatingPrompt);
    setFloatingPrompt('');
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#0f3d3e] flex flex-col font-sans relative">
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#EFEADF]/90 backdrop-blur-md border-b border-[#0f3d3e]/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2" onClick={() => onSelectView('dashboard')}>
          <span className="text-xl">🌿</span>
          <span className="font-semibold text-base text-[#0f3d3e]">Orenda Vault</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg text-[#0f3d3e] hover:bg-[#0f3d3e]/10"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeView={activeView}
          onSelectView={onSelectView}
          onNewWorkspace={onNewWorkspace}
          onTriggerAITool={onTriggerAITool}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-[#0f3d3e]/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-64 bg-[#EFEADF] h-full z-10 shadow-2xl"
            >
              <Sidebar
                activeView={activeView}
                onSelectView={(view) => {
                  onSelectView(view);
                  setIsMobileOpen(false);
                }}
                onNewWorkspace={() => {
                  onNewWorkspace();
                  setIsMobileOpen(false);
                }}
                onTriggerAITool={(id, prompt) => {
                  onTriggerAITool(id, prompt);
                  setIsMobileOpen(false);
                }}
                isCollapsed={false}
                onToggleCollapse={() => setIsMobileOpen(false)}
                onOpenAuth={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileOpen(false);
                }}
                onOpenSettings={() => {
                  setIsSettingsModalOpen(true);
                  setIsMobileOpen(false);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Workspace Area */}
      <main
        className={`flex-1 transition-all duration-300 pb-28 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">{children}</div>
      </main>

      {/* Sticky Floating AI Input Bottom Command Bar */}
      <div
        className={`fixed bottom-6 left-4 right-4 z-20 transition-all duration-300 ${
          isCollapsed ? 'lg:left-24' : 'lg:left-68'
        } lg:right-8 max-w-3xl mx-auto`}
      >
        <form
          onSubmit={handleFloatingSubmit}
          className="bg-white/85 backdrop-blur-xl border border-[#0f3d3e]/15 rounded-2xl shadow-2xl p-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#0f3d3e]/30 transition-all"
        >
          <div className="p-2 rounded-xl bg-[#A8E063]/30 text-[#0f3d3e] flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#0f3d3e]" />
          </div>
          <Input
            value={floatingPrompt}
            onChange={(e) => setFloatingPrompt(e.target.value)}
            placeholder="✨ Ask Orenda... (e.g., Explain JWT, brainstorm blog topics, or search notes)"
            className="w-full border-none shadow-none bg-transparent"
            style={{ boxShadow: 'none', background: 'transparent' }}
          />
          <button
            type="submit"
            disabled={!floatingPrompt.trim()}
            className="p-2.5 rounded-xl bg-[#0F4C3A] text-[#F7F3EA] hover:bg-[#0F4C3A]/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-soft"
            title="Send to Orenda AI"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      <ProfileSettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
      />
    </div>
  );
};
