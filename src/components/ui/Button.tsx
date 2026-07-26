'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]/20 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-[#0F4C3A] text-[#F7F3EA] hover:bg-[#0F4C3A]/90 shadow-soft',
    secondary: 'bg-white/80 border border-[#0f3d3e]/10 text-[#0f3d3e] hover:bg-white hover:border-[#0f3d3e]/20 shadow-soft',
    ghost: 'text-[#0f3d3e] hover:bg-[#0f3d3e]/5',
    accent: 'bg-[#A8E063] text-[#0f3d3e] font-semibold hover:bg-[#95cc56] shadow-soft',
    danger: 'bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/20',
    icon: 'p-2 text-[#0f3d3e] hover:bg-[#0f3d3e]/10 rounded-lg',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
    icon: 'p-2',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
