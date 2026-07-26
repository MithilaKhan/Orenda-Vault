'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  glass?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  glass = true,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'rounded-2xl p-5 transition-all duration-200 border border-[#0f3d3e]/10';
  const glassStyle = glass ? 'bg-white/70 backdrop-blur-md' : 'bg-white';
  const hoverStyle = hoverEffect ? 'cursor-pointer hover:bg-white hover:border-[#0f3d3e]/25 hover:-translate-y-0.5 shadow-soft hover:shadow-lg' : 'shadow-soft';

  return (
    <div
      className={`${baseStyles} ${glassStyle} ${hoverStyle} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};
