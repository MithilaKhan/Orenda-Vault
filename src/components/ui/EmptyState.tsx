'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from './Button';
import { Plus, Bookmark } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  onCreateNote?: () => void;
  onImportBookmark?: () => void;
  onSuggestionClick?: (suggestion: string) => void;
  buttonText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nothing saved yet.',
  description = 'Start building your second brain with Orenda Vault.',
  onCreateNote,
  onImportBookmark,
  buttonText,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 sm:p-12 text-center bg-white/50 backdrop-blur-xl rounded-3xl border border-[#0f3d3e]/10 max-w-lg mx-auto my-8 shadow-soft transition-all">
      {/* Real Cropped Logo Icon */}
      <span className="inline-flex items-center justify-center overflow-hidden rounded-2xl shadow-soft border border-[#0f3d3e]/10 mb-4 bg-white flex-shrink-0" style={{ width: 64, height: 64 }}>
        <Image
          src="/logo-mockup.png"
          alt="Orenda Vault Logo"
          width={102}
          height={102}
          style={{ objectFit: 'cover', width: 102, height: 102 }}
          priority
        />
      </span>

      <h3 className="text-lg font-bold text-[#0f3d3e] mb-1.5">{title}</h3>
      <p className="text-sm text-[#4B5563] mb-6 max-w-sm leading-relaxed">{description}</p>

      {/* Decorative accent divider line */}
      <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#0f3d3e]/20 to-transparent mb-6" />

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onCreateNote && (
          <Button variant="primary" size="sm" onClick={onCreateNote} icon={<Plus className="w-4 h-4" />}>
            {buttonText || 'Create Note'}
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

