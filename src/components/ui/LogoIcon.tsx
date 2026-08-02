import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
      <path 
        d="M5 12C8 12 9 9 12 9C15 9 16 12 19 12" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      <path 
        d="M5 15C8 15 9 12 12 12C15 12 16 15 19 15" 
        stroke="currentColor" 
        strokeWidth="1" 
        strokeLinecap="round" 
        opacity="0.6" 
      />
    </svg>
  );
};
