'use client';

import React from 'react';
import { Note } from '@/types/workspace';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { Clock, ArrowRight } from 'lucide-react';
import { formatRelativeOrDate } from '@/helpers/dateHelper';

export interface RecentNoteCardProps {
  note: Note;
  onSelect: (note: Note) => void;
}

export const RecentNoteCard: React.FC<RecentNoteCardProps> = ({ note, onSelect }) => {

  return (
    <Card
      hoverEffect
      onClick={() => onSelect(note)}
      className="flex items-start justify-between gap-4 p-4 bg-white/75 hover:bg-white border-[#0f3d3e]/15 group min-h-[120px]"
    >
      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-base text-[#0f3d3e] truncate">
            {note.title}
          </h4>
          {note.isFavorite && <span className="text-amber-500 text-xs shrink-0">⭐</span>}
        </div>
        <div 
          className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed font-normal"
          dangerouslySetInnerHTML={{ __html: note.summary || note.content }}
        />
        <div className="flex flex-wrap items-center gap-1.5 pt-1.5">

          <span className="text-[11px] text-[#4B5563]/80 flex items-center gap-1 ml-auto font-medium shrink-0">
            <Clock className="w-3 h-3" />
            {formatRelativeOrDate(note.updatedAt)}
          </span>
        </div>
      </div>
      <div className="self-center pl-2 shrink-0">
        <div className="w-8 h-8 rounded-full bg-[#0f3d3e]/5 group-hover:bg-[#0F4C3A] group-hover:text-[#F7F3EA] flex items-center justify-center text-[#0f3d3e] transition-colors">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Card>
  );
};
