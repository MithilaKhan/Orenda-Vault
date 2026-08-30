'use client';

import React from 'react';
import Image from 'next/image';
import { Menu, X, Home, FileText, Folder, Star, Clock, Sparkles, Search, Plus } from 'lucide-react';
import { WorkspaceView } from '@/types/workspace';
import { MAIN_NAV_ITEMS, AI_TOOLS } from '@/constants/navigation';
import { AnimatePresence, motion } from 'framer-motion';

interface MobileHeaderProps {
  onSelectView: (view: WorkspaceView) => void;
  isMobileOpen: boolean;
  onToggleMobileOpen: () => void;
  activeView?: WorkspaceView;
  onNewWorkspace?: () => void;
  onTriggerAITool?: (toolId: string, prompt: string) => void;
}

const getIcon = (iconName: string, className = 'w-5 h-5') => {
  switch (iconName) {
    case 'Home': return <Home className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'Folder': return <Folder className={className} />;
    case 'Star': return <Star className={className} />;
    case 'Clock': return <Clock className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Search': return <Search className={className} />;
    default: return <FileText className={className} />;
  }
};

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onSelectView,
  isMobileOpen,
  onToggleMobileOpen,
  activeView = 'dashboard',
  onNewWorkspace,
  onTriggerAITool,
}) => {
  const handleNavClick = (view: WorkspaceView) => {
    onSelectView(view);
    onToggleMobileOpen();
  };

  return (
    <>
      <header className="lg:hidden sticky top-0 z-40 bg-[#EFEADF]/90 backdrop-blur-md border-b border-[#0f3d3e]/10 px-4 py-3 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onSelectView('dashboard')}
        >
          <span
            className="inline-flex items-center justify-center overflow-hidden rounded-full"
            style={{ width: 28, height: 28 }}
          >
            <Image
              src="/logo-mockup.png"
              alt="Orenda AI"
              width={45}
              height={45}
              style={{ objectFit: 'cover', width: 45, height: 45 }}
              priority
            />
          </span>
          <span className="font-semibold text-base text-[#0f3d3e]">Orenda Vault</span>
        </div>
        <button
          onClick={onToggleMobileOpen}
          className="p-2 rounded-lg text-[#0f3d3e] hover:bg-[#0f3d3e]/10 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-[#0f3d3e]/40 backdrop-blur-sm lg:hidden"
              onClick={onToggleMobileOpen}
            />
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 bottom-0 z-40 w-72 bg-[#EFEADF] border-r border-[#0f3d3e]/10 flex flex-col lg:hidden shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-[#0f3d3e]/10">
                <div className="flex items-center gap-2">
                  <Image src="/logo-mockup.png" alt="Orenda Vault" width={32} height={32} className="rounded-full object-cover" />
                  <span className="font-bold text-[#0f3d3e] text-lg">Orenda Vault</span>
                </div>
                <button onClick={onToggleMobileOpen} className="p-1.5 rounded-lg hover:bg-[#0f3d3e]/10 text-[#0f3d3e]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {/* New Note Button */}
                {onNewWorkspace && (
                  <button
                    onClick={() => { onNewWorkspace(); onToggleMobileOpen(); }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-linear-to-r from-[#255c4b] to-[#A8E063]/70 text-white font-semibold shadow-soft active:scale-[0.98] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Create Note</span>
                  </button>
                )}

                <div className="h-px bg-[#0f3d3e]/10" />

                {/* Main Navigation */}
                <nav className="space-y-1">
                  {MAIN_NAV_ITEMS.map((item) => {
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                            ? 'bg-[#0F4C3A] text-white shadow-soft font-semibold'
                            : 'text-[#0f3d3e]/80 hover:bg-[#0f3d3e]/5 hover:text-[#0f3d3e]'
                          }`}
                      >
                        {getIcon(item.iconName, isActive ? 'w-4 h-4 text-white' : 'w-4 h-4 text-[#4B5563]')}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="h-px bg-[#0f3d3e]/10" />

                {/* AI Tools */}
                <div className="space-y-1">
                  <p className="px-3 text-[11px] font-semibold tracking-wider text-[#4B5563] uppercase">AI Tools</p>
                  {AI_TOOLS.map((tool) => {
                    const isActive = activeView === tool.id;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => {
                          if (tool.id === 'search') {
                            handleNavClick('dashboard');
                          } else if (tool.id === 'chat') {
                            handleNavClick('chat');
                          } else if (onTriggerAITool) {
                            onTriggerAITool(tool.id, tool.prompt);
                            onToggleMobileOpen();
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                            ? 'bg-[#0F4C3A] text-white shadow-soft font-semibold'
                            : 'text-[#0f3d3e]/80 hover:bg-[#0f3d3e]/5 hover:text-[#0f3d3e]'
                          }`}
                      >
                        {getIcon(tool.iconName, isActive ? 'w-4 h-4 text-white' : 'w-4 h-4 text-[#4B5563]')}
                        <span>{tool.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
