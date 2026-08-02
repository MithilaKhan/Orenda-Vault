'use client';

import React from 'react';
import { Modal as AntModal, ConfigProvider } from 'antd';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
}) => {
  // Derive numeric width for Ant Modal, capped at viewport width on mobile
  const desktopWidth = maxWidth.includes('2xl') ? 768 : maxWidth.includes('xl') ? 640 : 520;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0F4C3A',
          colorText: '#0f3d3e',
          colorTextSecondary: '#4B5563',
          borderRadiusLG: 16,
          colorBgElevated: '#F7F3EA',
        },
      }}
    >
      <AntModal
        open={isOpen}
        onCancel={onClose}
        title={title ? <span className="font-semibold text-lg text-[#0f3d3e]">{title}</span> : null}
        footer={null}
        centered
        width={desktopWidth}
        style={{ maxWidth: 'calc(100vw - 32px)' }}
        destroyOnHidden
        className="custom-antd-modal"
        styles={{
          body: {
            maxHeight: 'calc(100dvh - 200px)',
            overflowY: 'auto',
          },
        }}
      >
        <div className="pt-2">{children}</div>
      </AntModal>
    </ConfigProvider>
  );
};
