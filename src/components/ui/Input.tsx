'use client';

import React from 'react';
import { Input as AntInput, ConfigProvider } from 'antd';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({
  icon,
  label,
  error,
  className = '',
  value,
  onChange,
  placeholder,
  ...props
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0F4C3A',
          colorText: '#0f3d3e',
          colorTextPlaceholder: '#4B5563',
          borderRadius: 12,
          controlHeight: 42,
        },
      }}
    >
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-[#0f3d3e] uppercase tracking-wider">
            {label}
          </label>
        )}
        <AntInput
          prefix={icon ? <span className="text-[#4B5563] mr-1.5 flex items-center">{icon}</span> : undefined}
          value={value}
          onChange={onChange as any}
          placeholder={placeholder}
          status={error ? 'error' : undefined}
          className={`w-full bg-white/90 border-[#0f3d3e]/20 text-sm text-[#0f3d3e] ${className}`}
          {...(props as any)}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </ConfigProvider>
  );
};
