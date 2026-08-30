'use client';

import React from 'react';
import { Note, Collection } from '@/types/workspace';
import { Table } from 'antd';
import { Star, Edit3, Trash2, RotateCcw, X, Folder } from 'lucide-react';
import { formatRelativeOrDate } from '@/helpers/dateHelper';

export interface NoteTableViewProps {
  notes: Note[];
  collections: Collection[];
  isTrashView?: boolean;
  onOpenEdit: (note: Note) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onRestoreNote?: (id: string) => void;
  onPermanentlyDeleteNote?: (id: string) => void;
}

export const NoteTableView: React.FC<NoteTableViewProps> = ({
  notes,
  collections,
  isTrashView = false,
  onOpenEdit,
  onToggleFavorite,
  onDeleteNote,
  onRestoreNote,
  onPermanentlyDeleteNote,
}) => {
  return (
    <div className="bg-white/80 rounded-2xl p-2 sm:p-4 border border-[#0f3d3e]/15 shadow-soft overflow-hidden">
      <div className="overflow-x-auto -mx-2 sm:mx-0">
      <Table
        dataSource={notes}
        rowKey="id"
        pagination={{ pageSize: 8, size: 'small' }}
        scroll={{ x: 560 }}
        columns={[
          {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            minWidth: 160,
            render: (text, record) => (
              <span
                className="font-semibold text-[#0f3d3e] hover:text-[#0f3d3e] cursor-pointer"
                onClick={() => !isTrashView && onOpenEdit(record)}
              >
                {text}
              </span>
            ),
          },
          {
            title: 'Collection',
            key: 'collection',
            minWidth: 120,
            render: (_, record) => {
              const col = collections.find(c => c.id === record.collectionId);
              return col ? (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#0f3d3e]/5 text-[#0f3d3e] font-medium">
                  <Folder className="w-3 h-3" /> {col.name}
                </span>
              ) : (
                <span className="text-xs text-[#4B5563]">General</span>
              );
            },
          },

          {
            title: 'Summary',
            dataIndex: 'summary',
            key: 'summary',
            minWidth: 160,
            responsive: ['md'] as ('md')[],
            render: (text) => {
              const clean = text ? text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';
              return <span className="text-xs text-[#4B5563] line-clamp-1">{clean || '—'}</span>;
            },
          },
          {
            title: 'Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            minWidth: 90,
            render: (date) => <span className="text-xs text-[#4B5563]">{formatRelativeOrDate(date)}</span>,
          },
          {
            title: 'Actions',
            key: 'actions',
            minWidth: 90,
            render: (_, record) => (
              <div className="flex items-center gap-1.5">
                {!isTrashView ? (
                  <>
                    <button
                      onClick={() => onToggleFavorite(record.id)}
                      className="p-1 rounded hover:bg-[#0f3d3e]/10 text-[#4B5563]"
                      title="Favorite"
                    >
                      <Star className={`w-3.5 h-3.5 ${record.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => onOpenEdit(record)}
                      className="p-1 rounded hover:bg-[#0f3d3e]/10 text-[#4B5563]"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteNote(record.id)}
                      className="p-1 rounded hover:bg-red-500/10 text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    {onRestoreNote && (
                      <button onClick={() => onRestoreNote(record.id)} className="p-1 text-[#0f3d3e]" title="Restore">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onPermanentlyDeleteNote && (
                      <button onClick={() => onPermanentlyDeleteNote(record.id)} className="p-1 text-red-500" title="Delete Permanently">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </>
                )}
              </div>
            ),
          },
        ]}
      />
      </div>
    </div>
  );
};
