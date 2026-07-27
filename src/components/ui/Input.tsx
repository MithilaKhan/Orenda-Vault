'use client';

import React from 'react';
import { Input as AntInput, ConfigProvider } from 'antd';
import type { InputProps as AntInputProps } from 'antd';
import type { TextAreaProps as AntTextAreaProps } from 'antd/es/input';

export interface InputProps extends Omit<AntInputProps, 'onChange'> {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  size?: 'large' | 'middle' | 'small';
}

export interface TextAreaProps extends Omit<AntTextAreaProps, 'onChange'> {
  label?: React.ReactNode;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const antdTheme = {
  token: {
    colorPrimary: '#0F4C3A',
    colorText: '#0f3d3e',
    colorTextPlaceholder: '#4B5563',
    borderRadius: 12,
    controlHeight: 42,
  },
};

export const Input: React.FC<InputProps> = ({
  icon,
  label,
  error,
  className = '',
  value,
  onChange,
  placeholder,
  size = 'middle',
  ...props
}) => {
  return (
    <ConfigProvider theme={antdTheme}>
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
          size={size}
          className={`w-full bg-white/90 border-[#0f3d3e]/20 text-sm text-[#0f3d3e] font-medium ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </ConfigProvider>
  );
};

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  className = '',
  value,
  onChange,
  placeholder,
  rows = 4,
  ...props
}) => {
  return (
    <ConfigProvider theme={antdTheme}>
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-[#0f3d3e] uppercase tracking-wider">
            {label}
          </label>
        )}
        <AntInput.TextArea
          value={value}
          onChange={onChange as any}
          placeholder={placeholder}
          status={error ? 'error' : undefined}
          rows={rows}
          className={`w-full bg-white/90 border-[#0f3d3e]/20 text-sm text-[#0f3d3e] font-medium leading-relaxed ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </ConfigProvider>
  );
};
