'use client';

import React from 'react';
import { Button } from './Button';
import { Plus, Bookmark } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  onCreateNote?: () => void;
  onImportBookmark?: () => void;
  onSuggestionClick?: (suggestion: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nothing saved yet.',
  description = 'Start building your second brain with Orenda Vault.',
  onCreateNote,
  onImportBookmark,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white/40 backdrop-blur-md rounded-3xl border border-[#0f3d3e]/10 max-w-lg mx-auto my-8 shadow-soft">
      {/* Organic Illustration / Icon */}
      <div className="w-16 h-16 rounded-full bg-[#EFEADF] flex items-center justify-center text-3xl mb-4 shadow-inner border border-[#0f3d3e]/10">
        🌱
      </div>

      <h3 className="text-lg font-semibold text-[#0f3d3e] mb-1">{title}</h3>
      <p className="text-sm text-[#4B5563] mb-6 max-w-sm leading-relaxed">{description}</p>

      {/* Timeline illustration hint */}
      <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#0f3d3e]/20 to-transparent mb-6" />

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onCreateNote && (
          <Button variant="accent" size="sm" onClick={onCreateNote} icon={<Plus className="w-4 h-4" />}>
            Create Note
          </Button>
        )}
        {onImportBookmark && (
          <Button variant="secondary" size="sm" onClick={onImportBookmark} icon={<Bookmark className="w-4 h-4" />}>
            Import Bookmark
          </Button>
        )}
      </div>
    </div>
  );
};
