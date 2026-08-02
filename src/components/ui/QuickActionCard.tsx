'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { QuickActionCardConfig } from '@/constants/constants.type';
import { ActionType } from '@/shared/shared.type';
import { FileEdit, Bookmark, FileText, Code2, Lightbulb, ClipboardCheck, Sparkles } from 'lucide-react';

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
      case 'Bookmark': return <Bookmark {...props} />;
      case 'FileText': return <FileText {...props} />;
      case 'Code2': return <Code2 {...props} />;
      case 'Lightbulb': return <Lightbulb {...props} />;
      case 'ClipboardCheck': return <ClipboardCheck {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  const badgeBg = index % 3 === 0 ? 'bg-[#A8E063]/30 text-[#0f3d3e]' : index % 3 === 1 ? 'bg-[#0f3d3e]/10 text-[#0f3d3e]' : 'bg-[#4B5563]/20 text-[#0f3d3e]';

  return (
    <Card
      hoverEffect
      onClick={() => onClick(card.actionType)}
      className="group flex flex-col justify-between min-h-40 h-auto sm:h-48 bg-white/75 hover:bg-white border-[#0f3d3e]/15 hover:border-[#0f3d3e]/30 transition-all shadow-soft hover:shadow-md relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0f3d3e]/30 via-[#A8E063] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-2xl ${badgeBg} group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
            {getActionIcon(card.icon)}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0f3d3e]/5 text-[#0f3d3e] group-hover:bg-[#0F4C3A] group-hover:text-[#F7F3EA] transition-colors">
            + Capture
          </span>
        </div>
        <div>
          <h4 className="font-bold text-lg text-[#0f3d3e] group-hover:text-[#0f3d3e] transition-colors">
            {card.title}
          </h4>
          <p className="text-xs text-[#4B5563] mt-1 leading-relaxed font-normal">
            {card.description}
          </p>
        </div>
      </div>
    </Card>
  );
};
