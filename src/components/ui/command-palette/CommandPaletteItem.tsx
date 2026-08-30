'use client';

import React from 'react';
import { CommandPaletteItemData } from './commandPalette.type';

interface CommandPaletteItemProps {
  item: CommandPaletteItemData;
  isActive: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
}

export const CommandPaletteItem: React.FC<CommandPaletteItemProps> = ({
  item,
  isActive,
  onSelect,
  onMouseEnter,
}) => {
  return (
    <div
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-sm select-none ${
        isActive
          ? 'bg-[#0F4C3A] text-white shadow-md'
          : 'text-[#0f3d3e] hover:bg-[#0F4C3A]/10'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={`p-1.5 rounded-lg shrink-0 transition-colors ${
            isActive
              ? 'bg-white/20 text-white'
              : 'bg-[#0F4C3A]/10 text-[#0F4C3A]'
          }`}
        >
          {item.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium truncate leading-snug">{item.title}</div>
          {item.subtitle && (
            <div
              className={`text-xs truncate transition-colors ${
                isActive ? 'text-white/70' : 'text-[#0f3d3e]/60'
              }`}
              dangerouslySetInnerHTML={{ __html: item.subtitle }}
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-3">
        {item.badge && (
          <span
            className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
              isActive
                ? 'bg-white/20 border-white/30 text-white'
                : 'bg-[#0F4C3A]/5 border-[#0F4C3A]/15 text-[#0F4C3A]'
            }`}
          >
            {item.badge}
          </span>
        )}
        {item.shortcut && (
          <span
            className={`text-xs font-mono px-1.5 py-0.5 rounded border ${
              isActive
                ? 'bg-white/20 border-white/30 text-white'
                : 'bg-[#0f3d3e]/5 border-[#0f3d3e]/10 text-[#0f3d3e]/50'
            }`}
          >
            {item.shortcut}
          </span>
        )}
      </div>
    </div>
  );
};
