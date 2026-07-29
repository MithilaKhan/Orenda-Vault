'use client';

import React from 'react';
import { 
  Home, 
  FileText, 
  Folder, 
  Star, 
  Clock, 
  Trash2, 
  Sparkles, 
  Tag as TagIcon, 
  Search, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  User 
} from 'lucide-react';
import { WorkspaceView } from '@/types/workspace';
import { MAIN_NAV_ITEMS, AI_TOOLS } from '@/constants/navigation';

export interface SidebarProps {
  activeView: WorkspaceView;
  onSelectView: (view: WorkspaceView) => void;
  onNewWorkspace: () => void;
  onTriggerAITool: (toolId: string, prompt: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  onNewWorkspace,
  onTriggerAITool,
  isCollapsed,
  onToggleCollapse,
}) => {
  const getIcon = (iconName: string, className: string = 'w-4 h-4') => {
    switch (iconName) {
      case 'Home': return <Home className={className} />;
      case 'FileText': return <FileText className={className} />;
      case 'Folder': return <Folder className={className} />;
      case 'Star': return <Star className={className} />;
      case 'Clock': return <Clock className={className} />;
      case 'Trash2': return <Trash2 className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Tag': return <TagIcon className={className} />;
      case 'Search': return <Search className={className} />;
      default: return <FileText className={className} />;
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 bg-[#EFEADF] border-r border-[#0f3d3e]/10 transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Navigation */}
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4">
        {/* Logo & Collapse Button */}
        <div className="flex items-center justify-between px-2 py-2">
          {!isCollapsed ? (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSelectView('dashboard')}>
              <span className="text-xl">🌿</span>
              <span className="font-semibold tracking-tight text-lg text-[#0f3d3e]">Orenda Vault</span>
            </div>
          ) : (
            <div className="mx-auto cursor-pointer" onClick={() => onSelectView('dashboard')}>
              <span className="text-2xl">🌿</span>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#0f3d3e] hover:bg-[#0f3d3e]/5 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* + New Workspace Button */}
        <button
          onClick={onNewWorkspace}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#A8E063] hover:bg-[#95cc56] text-[#0f3d3e] font-semibold transition-all shadow-soft active:scale-[0.98] ${
            isCollapsed ? 'px-0' : ''
          }`}
          title="New Workspace Note"
        >
          <Plus className="w-4 h-4 flex-shrink-0 font-semibold" />
          {!isCollapsed && <span className="text-sm">New Workspace</span>}
        </button>

        <div className="h-px bg-[#0f3d3e]/10 my-2" />

        {/* Main Navigation Items */}
        <nav className="space-y-1">
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#0F4C3A] text-[#F7F3EA] shadow-soft font-semibold'
                    : 'text-[#0f3d3e]/80 hover:bg-[#0f3d3e]/5 hover:text-[#0f3d3e]'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={item.label}
              >
                {getIcon(item.iconName, isActive ? 'w-4 h-4 text-[#A8E063]' : 'w-4 h-4 text-[#4B5563]')}
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="h-px bg-[#0f3d3e]/10 my-2" />

        {/* AI Tools Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-semibold tracking-wider text-[#4B5563] uppercase">
              AI Tools
            </p>
          )}
          {AI_TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                if (tool.id === 'search') {
                  onSelectView('dashboard');
                } else if (tool.id === 'chat') {
                  onSelectView('chat');
                } else {
                  onTriggerAITool(tool.id, tool.prompt);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[#0f3d3e]/80 hover:bg-[#0f3d3e]/5 hover:text-[#0f3d3e] transition-all ${
                isCollapsed ? 'justify-center px-0' : ''
              }`}
              title={`${tool.label} - AI Action`}
            >
              {getIcon(tool.iconName, 'w-4 h-4 text-[#4B5563]')}
              {!isCollapsed && <span>{tool.label}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Profile Footer */}
      <div className="p-3 border-t border-[#0f3d3e]/10 bg-white/40">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#0F4C3A] text-[#F7F3EA] flex items-center justify-center font-semibold text-xs flex-shrink-0 shadow-soft">
              MK
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-[#0f3d3e] truncate">Mithila Khan</p>
                <p className="text-[10px] text-[#4B5563] truncate">Pro Vault Plan 🌿</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button 
              onClick={() => onSelectView('dashboard')}
              className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#0f3d3e] hover:bg-[#0f3d3e]/5 transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
