'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { QuickActionCardConfig } from '@/constants/constants.type';
import { ActionType } from '@/shared/shared.type';
import { FileEdit, FileText, Code2, FolderPlus, Sparkles } from 'lucide-react';

export interface QuickActionCardProps {
  card: QuickActionCardConfig;
  index: number;
  onClick: (actionType: ActionType) => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({ card, index, onClick }) => {
  const getActionIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6 text-[#0f3d3e]' };
    switch (iconName) {
      case 'FileEdit': return <FileEdit {...props} />;
      case 'Code2': return <Code2 {...props} />;
      case 'FolderPlus': return <FolderPlus {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'FileText': return <FileText {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  const badgeBg = index % 4 === 0 ? 'bg-[#A8E063]/30 text-[#0f3d3e]' : index % 4 === 1 ? 'bg-[#0f3d3e]/10 text-[#0f3d3e]' : index % 4 === 2 ? 'bg-amber-500/15 text-[#0f3d3e]' : 'bg-emerald-500/15 text-[#0f3d3e]';

  return (
    <Card
      hoverEffect
      onClick={() => onClick(card.actionType)}
      className="group flex flex-col justify-between h-full min-h-[175px] bg-white/75 hover:bg-white border-[#0f3d3e]/15 hover:border-[#0f3d3e]/30 transition-all shadow-soft hover:shadow-md relative overflow-hidden p-5 cursor-pointer"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0f3d3e]/30 via-[#A8E063] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="space-y-3 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className={`p-2.5 rounded-2xl ${badgeBg} group-hover:scale-110 transition-transform duration-200 shadow-xs`}>
            {getActionIcon(card.icon)}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0f3d3e]/5 text-[#0f3d3e] group-hover:bg-[#0F4C3A] group-hover:text-[#F7F3EA] transition-colors">
            + Capture
          </span>
        </div>
        <div className="space-y-1 mt-auto">
          <h4 className="font-bold text-base text-[#0f3d3e] group-hover:text-[#0F4C3A] transition-colors">
            {card.title}
          </h4>
          <p className="text-xs text-[#4B5563] leading-relaxed font-normal line-clamp-2">
            {card.description}
          </p>
        </div>
      </div>
    </Card>
  );
};
