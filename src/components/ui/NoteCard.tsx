'use client';

import React, { useState } from 'react';
import { Note, Collection } from '@/types/workspace';
import { Card } from '@/components/ui/Card';
import { Star, Clock, Folder, Sparkles, Edit3, Trash2, RotateCcw, X, Check, Loader2 } from 'lucide-react';
import { formatRelativeOrDate } from '@/helpers/dateHelper';
import { aiService } from '@/services/aiService';
import toast from 'react-hot-toast';

export interface NoteCardProps {
  note: Note;
  collection?: Collection;
  isTrashView?: boolean;
  onFavorite: (id: string) => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentlyDelete?: (id: string) => void;
  onUpdateNote: (id: string, partial: Partial<Note>) => void;
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
  onUpdateNote,
}) => {
  const [isAiSummarizing, setIsAiSummarizing] = useState(false);
  const [pendingSummary, setPendingSummary] = useState<string | null>(null);

  const handleAiSummarize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAiSummarizing(true);
    setPendingSummary(null);
    try {
      const summary = await aiService.summarizeText(note.content);
      if (summary && !summary.includes('Failed to')) {
        setPendingSummary(summary);
      } else {
        toast.error('Unable to generate summary');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsAiSummarizing(false);
    }
  };

  const handleConfirmSummary = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pendingSummary) {
      onUpdateNote(note.id, { summary: pendingSummary });
      toast.success('Description updated with AI summary');
      setPendingSummary(null);
    }
  };

  const handleDismissSummary = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingSummary(null);
  };

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

      {/* Pending AI Summary Preview */}
      {pendingSummary && (
        <div
          className="p-3 rounded-xl bg-gradient-to-br from-[#0F4C3A]/5 to-[#A8E063]/10 border border-[#0F4C3A]/15 space-y-2 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[#0F4C3A] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Summary Preview
            </span>
          </div>
          <div
            className="text-[11px] text-[#0f3d3e] leading-relaxed line-clamp-4"
            dangerouslySetInnerHTML={{
              __html: pendingSummary
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br/>')
            }}
          />
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleConfirmSummary}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0F4C3A] text-white text-[10px] font-semibold hover:bg-[#0F4C3A]/90 transition-colors"
            >
              <Check className="w-3 h-3" /> Use as Description
            </button>
            <button
              onClick={handleDismissSummary}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#0f3d3e]/15 text-[#4B5563] text-[10px] font-semibold hover:bg-gray-50 transition-colors"
            >
              <X className="w-3 h-3" /> Dismiss
            </button>
          </div>
        </div>
      )}

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
                  onClick={handleAiSummarize}
                  className="p-1.5 rounded-lg text-[#0f3d3e] hover:bg-[#0F4C3A]/10 transition-colors relative group/btn"
                  title="Generate AI Summary"
                  disabled={isAiSummarizing}
                >
                  {isAiSummarizing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0F4C3A]" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
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
