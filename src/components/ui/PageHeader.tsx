'use client';

import React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#0f3d3e]/10 mb-8">
      <div className="flex items-start gap-3.5">
        {icon && (
          <div className="p-2.5 rounded-2xl bg-white border border-[#0f3d3e]/10 text-[#0f3d3e] shadow-soft flex-shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#0f3d3e]">{title}</h1>
          {description && <p className="text-sm text-[#4B5563] mt-1">{description}</p>}
        </div>
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
};
