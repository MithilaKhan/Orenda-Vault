'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface CommandPaletteHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const CommandPaletteHeader: React.FC<CommandPaletteHeaderProps> = ({
  query,
  onQueryChange,
  inputRef,
}) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#0f3d3e]/10 bg-white/50 backdrop-blur-xs">
      <Search className="w-5 h-5 text-[#0F4C3A] shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search notes, collections, or type a command..."
        className="w-full bg-transparent text-base text-[#0f3d3e] placeholder:text-[#0f3d3e]/40 outline-none border-none shadow-none focus:ring-0"
      />
      {query && (
        <button
          onClick={() => onQueryChange('')}
          className="p-1 rounded-lg hover:bg-[#0f3d3e]/10 text-[#0f3d3e]/50 hover:text-[#0f3d3e] transition-colors"
          title="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
