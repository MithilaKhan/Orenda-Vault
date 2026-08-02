'use client';

import React, { useState } from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { EmptyState } from '@/components/ui/EmptyState';
import { QUICK_ACTION_CARDS, SEARCH_SUGGESTIONS } from '@/constants/defaultData';
import { Note, Collection, ActivityItem, ActionType } from '@/types/workspace';
import { Search, Sparkles, ArrowRight, Folder, Briefcase, Code, FileText } from 'lucide-react';
import { QuickActionCard } from '@/components/ui/QuickActionCard';
import { RecentNoteCard } from '@/components/ui/RecentNoteCard';
import { Input } from '@/components/ui/Input';

export interface DashboardProps {
  notes: Note[];
  collections: Collection[];
  activities: ActivityItem[];
  onSelectNote: (note: Note) => void;
  onSelectCollection: (colId: string) => void;
  onActionCardClick: (actionType: ActionType) => void;
  onSearchSubmit: (query: string) => void;
  onQuickNoteCreate: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  notes,
  collections,
  activities,
  onSelectNote,
  onSelectCollection,
  onActionCardClick,
  onSearchSubmit,
  onQuickNoteCreate,
}) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const recentNotes = notes.filter(n => !n.isTrashed).slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchSubmit(searchInput.trim());
    }
  };

  const getColIcon = (iconName: string) => {
    const props = { className: 'w-4 h-4 text-[#0f3d3e]' };
    switch (iconName) {
      case 'Briefcase': return <Briefcase {...props} />;
      case 'Code': return <Code {...props} />;
      case 'FileText': return <FileText {...props} />;
      default: return <Folder {...props} />;
    }
  };

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      {/* Search Section */}
      <div className="bg-gradient-to-br from-white/90 via-white/70 to-white/90 p-6 sm:p-8 rounded-3xl border border-[#0f3d3e]/15 shadow-soft space-y-4">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f3d3e]/5 text-[#0f3d3e] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#0F4C3A]" /> AI Knowledge Vault
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f3d3e] tracking-tight">
            What would you like to create or recall today?
          </h2>
        </div>

        <form onSubmit={handleSearch} className="relative max-w-2xl">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              size="large"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search your second brain, notes, code, and collections..."
              icon={<Search className="w-5 h-5 text-[#4B5563]" />}
              className="flex-1 text-sm font-medium shadow-sm rounded-2xl"
            />
            <button
              type="submit"
              className="sm:absolute sm:right-2 sm:top-1.5 px-4 py-2 rounded-xl bg-[#0F4C3A] hover:bg-[#0F4C3A]/90 text-white text-xs font-semibold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 z-10 w-full sm:w-auto"
            >
              Ask AI <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Search Suggestions */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto scrollbar-none pb-1">
          <span className="text-xs text-[#0f3d3e] font-semibold flex-shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#0f3d3e]" /> Try:
          </span>
          {SEARCH_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchInput(sug);
                onSearchSubmit(sug);
              }}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full bg-white/70 border border-[#0f3d3e]/15 text-xs font-medium text-[#0f3d3e]/90 hover:bg-[#0F4C3A] hover:text-[#F7F3EA] transition-all shadow-soft active:scale-95"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div>
        <SectionTitle 
          title="Quick Actions" 
          subtitle="Capture and save knowledge."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {QUICK_ACTION_CARDS.map((card, index) => (
            <QuickActionCard key={card.id} card={card} index={index} onClick={onActionCardClick} />
          ))}
        </div>
      </div>

      {/* Recent Activity & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
        <div className="lg:col-span-2 space-y-4">
          <SectionTitle 
            title="Recent Activity" 
            subtitle="Recently updated content."
            action={
              <button 
                onClick={() => onSearchSubmit('')} 
                className="text-xs font-semibold text-[#0f3d3e] hover:underline flex items-center gap-1 bg-white/60 px-3 py-1 rounded-lg border border-[#0f3d3e]/10"
              >
                View all notes <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          />

          {recentNotes.length === 0 ? (
            <EmptyState 
              onCreateNote={onQuickNoteCreate} 
              onImportBookmark={() => onActionCardClick('website')} 
            />
          ) : (
            <div className="space-y-3.5">
              {recentNotes.map((note) => (
                <RecentNoteCard key={note.id} note={note} onSelect={onSelectNote} />
              ))}
            </div>
          )}
        </div>

        {/* Collections Sidebar & Recent Activity */}
        <div className="space-y-6">
          <div>
            <SectionTitle title="Collections" subtitle="Organize your knowledge." />
            <div className="space-y-2.5">
              {collections.slice(0, 4).map((col) => (
                <div
                  key={col.id}
                  onClick={() => onSelectCollection(col.id)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/70 hover:bg-white border border-[#0f3d3e]/15 cursor-pointer transition-all shadow-soft group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#EFEADF] group-hover:bg-[#A8E063]/30 text-[#0f3d3e] transition-colors">
                      {getColIcon(col.icon)}
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm text-[#0f3d3e] group-hover:text-[#0f3d3e]">{col.name}</h5>
                      <p className="text-[11px] text-[#4B5563]">{col.noteCount} items</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0f3d3e]/5 text-[#0f3d3e] group-hover:bg-[#0F4C3A] group-hover:text-[#F7F3EA] transition-colors">
                    {col.noteCount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle title="Timeline" subtitle="Recent workspace actions." />
            <div className="p-4 rounded-2xl bg-white/60 border border-[#0f3d3e]/15 space-y-3.5">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#A8E063] mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#0f3d3e] font-semibold truncate">{act.title}</p>
                    <p className="text-[#4B5563] text-[11px]">
                      {act.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
