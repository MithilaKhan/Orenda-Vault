'use client';

import React from 'react';

export interface TagProps {
  label: string;
  variant?: 'moss' | 'forest' | 'accent' | 'cream';
  onRemove?: () => void;
  onClick?: () => void;
}

export const Tag: React.FC<TagProps> = ({
  label,
  variant = 'moss',
  onRemove,
  onClick,
}) => {
  const variants = {
    moss: 'bg-[#4B5563]/15 text-[#0f3d3e] border-[#0f3d3e]/25',
    forest: 'bg-[#0F4C3A] text-[#F7F3EA] border-[#0f3d3e]',
    accent: 'bg-[#A8E063]/30 text-[#0f3d3e] border-[#A8E063]/50 font-medium',
    cream: 'bg-white text-[#4B5563] border-[#0f3d3e]/10',
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-colors ${
        variants[variant]
      } ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
    >
      <span>#{label}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:text-red-500 font-semibold ml-0.5"
        >
          ×
        </button>
      )}
    </span>
  );
};
