'use client';

import React from 'react';
import { Collection } from '@/types/workspace';
import { Card } from '@/components/ui/Card';
import { Folder, Briefcase, Code, FileText, Trash2 } from 'lucide-react';

export interface CollectionCardProps {
  collection: Collection;
  noteCount: number;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  noteCount,
  onSelect,
  onDelete,
}) => {
  const getColIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-[#0f3d3e]" />;
      case 'Code': return <Code className="w-5 h-5 text-[#0f3d3e]" />;
      case 'FileText': return <FileText className="w-5 h-5 text-[#0f3d3e]" />;
      default: return <Folder className="w-5 h-5 text-[#0f3d3e]" />;
    }
  };

  return (
    <Card
      hoverEffect
      onClick={() => onSelect(collection.id)}
      className="flex flex-col justify-between min-h-40 h-auto sm:h-48 bg-white/70 hover:bg-white border-[#0f3d3e]/15 group"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-2xl bg-[#EFEADF] group-hover:bg-[#A8E063]/30 transition-colors">
            {getColIcon(collection.icon)}
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0f3d3e]/5 text-[#0f3d3e]">
            {noteCount} {noteCount === 1 ? 'note' : 'notes'}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-lg text-[#0f3d3e] group-hover:text-[#0f3d3e]">
            {collection.name}
          </h3>
          <p className="text-xs text-[#4B5563] mt-1 line-clamp-2 leading-relaxed">
            {collection.description || 'No description provided.'}
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-[#0f3d3e]/10 flex items-center justify-between text-xs text-[#4B5563]">
        <span>Created {new Date(collection.createdAt).toLocaleDateString()}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(collection.id);
          }}
          className="p-1.5 rounded hover:text-red-500 hover:bg-red-500/10 transition-colors"
          title="Delete Collection"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
};
