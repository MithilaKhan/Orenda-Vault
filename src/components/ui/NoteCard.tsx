'use client';

import React from 'react';
import { Note, Collection } from '@/types/workspace';
import { Card } from '@/components/ui/Card';
import { Star, Clock, Folder, Sparkles, Tag as TagIcon, Edit3, Trash2, RotateCcw, X } from 'lucide-react';
import { formatRelativeOrDate } from '@/helpers/dateHelper';

export interface NoteCardProps {
  note: Note;
  collection?: Collection;
  isTrashView?: boolean;
  onFavorite: (id: string) => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentlyDelete?: (id: string) => void;
  onAiSummarize: (note: Note) => void;
  isAiSummarizing?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  collection,
  isTrashView = false,
  onFavorite,
  onEdit,
  onDelete,
  onRestore,
  onPermanentlyDelete,
  onAiSummarize,
  isAiSummarizing = false,
}) => {
  return (
    <Card
      hoverEffect={!isTrashView}
      onClick={isTrashView ? undefined : () => onEdit(note)}
      className="flex flex-col justify-between min-h-65 h-auto bg-white/70 hover:bg-white border-[#0f3d3e]/15 relative group p-5 gap-4"
    >
      {/* Note Top Bar */}
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base text-[#0f3d3e] line-clamp-2 flex-1 leading-snug">
            {note.title}
          </h3>
          {!isTrashView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite(note.id);
              }}
              className="p-1 rounded hover:bg-[#0f3d3e]/5 transition-colors shrink-0"
              title="Favorite"
            >
              <Star className={`w-4 h-4 ${note.isFavorite ? 'fill-amber-500 text-amber-500' : 'text-[#4B5563]'}`} />
            </button>
          )}
        </div>

        {/* Collection Badge */}
        {collection && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#0f3d3e]/5 text-[#0f3d3e] w-fit">
            <Folder className="w-3 h-3" /> {collection.name}
          </span>
        )}

        <div
          className="text-xs text-[#4B5563] line-clamp-3 leading-relaxed font-normal"
          dangerouslySetInnerHTML={{ __html: note.summary || note.content }}
        />
      </div>

      {/* Note Bottom Bar */}
      <div className="space-y-3 pt-3 border-t border-[#0f3d3e]/10 mt-auto">
        <div className="flex items-center justify-between text-[11px] text-[#4B5563] pt-1">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3" />
            {formatRelativeOrDate(note.updatedAt)}
          </span>

          <div className="flex items-center gap-1 opacity-85 group-hover:opacity-100 transition-opacity">
            {!isTrashView ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAiSummarize(note);
                  }}
                  className="p-1.5 rounded-lg text-[#0f3d3e] hover:bg-[#0F4C3A]/10 transition-colors"
                  title="Summarize"
                  disabled={isAiSummarizing}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAiSummarizing ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(note);
                  }}
                  className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#0f3d3e] hover:bg-[#0f3d3e]/10 transition-colors"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(note.id);
                  }}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                {onRestore && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRestore(note.id);
                    }}
                    className="p-1.5 rounded-lg text-[#0f3d3e] hover:bg-[#0F4C3A]/10 transition-colors flex items-center gap-1 font-medium"
                    title="Restore Note"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Restore
                  </button>
                )}
                {onPermanentlyDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPermanentlyDelete(note.id);
                    }}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Delete Permanently"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
