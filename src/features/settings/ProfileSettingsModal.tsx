import React from 'react';
import { Modal, ConfigProvider, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { EditProfileTab } from './tabs/EditProfileTab';
import { ChangePasswordTab } from './tabs/ChangePasswordTab';
import { User as UserIcon, KeyRound } from 'lucide-react';
import { User } from '@/shared/shared.type';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  setUser,
}) => {
  const items: TabsProps['items'] = [
    {
      key: 'profile',
      label: (
        <span className="flex items-center gap-2 font-semibold">
          <UserIcon className="w-4 h-4" />
          Edit Profile
        </span>
      ),
      children: <EditProfileTab user={user} setUser={setUser} />,
    },
    {
      key: 'password',
      label: (
        <span className="flex items-center gap-2 font-semibold">
          <KeyRound className="w-4 h-4" />
          Change Password
        </span>
      ),
      children: <ChangePasswordTab />,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0F4C3A',
          fontFamily: 'inherit',
          borderRadius: 12,
          colorBgElevated: '#F7F3EA',
        },
        components: {
          Tabs: {
            itemColor: '#6B7280',
            itemHoverColor: '#0F4C3A',
            itemSelectedColor: '#0F4C3A',
            inkBarColor: '#0F4C3A',
          },
        },
      }}
    >
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={580}
        centered
        className="settings-modal"
        styles={{
          mask: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(15, 61, 62, 0.4)' },
          body: { borderRadius: '24px', padding: '24px 16px' }
        }}
      >
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-[#0F4C3A]">Profile Settings</h2>
          <p className="text-[#4B5563] text-sm mt-1">Manage your account details and security</p>
        </div>
        <Tabs defaultActiveKey="profile" items={items} className="settings-tabs" />
      </Modal>
    </ConfigProvider>
  );
};
