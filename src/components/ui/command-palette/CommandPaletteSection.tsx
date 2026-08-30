'use client';

import React from 'react';

interface CommandPaletteSectionProps {
  title: string;
  children: React.ReactNode;
}

export const CommandPaletteSection: React.FC<CommandPaletteSectionProps> = ({
  title,
  children,
}) => {
  return (
    <div className="py-2 first:pt-0 last:pb-0">
      <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-[#0f3d3e]/50 uppercase">
        {title}
      </div>
      <div className="space-y-0.5 mt-0.5">{children}</div>
    </div>
  );
};
