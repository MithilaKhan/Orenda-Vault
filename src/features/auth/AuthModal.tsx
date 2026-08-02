import React, { useState } from 'react';
import { Modal, ConfigProvider } from 'antd';
import { SignInView } from './views/SignInView';
import { SignUpView } from './views/SignUpView';
import { ForgotPassView } from './views/ForgotPassView';
import { OtpVerifyView } from './views/OtpVerifyView';
import { ResetPassView } from './views/ResetPassView';

export type AuthView = 'signin' | 'signup' | 'forgot' | 'otp' | 'reset';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: AuthView;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultView = 'signin' 
}) => {
  const [currentView, setCurrentView] = useState<AuthView>(defaultView);

  // Reset view when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentView(defaultView);
    }
  }, [isOpen, defaultView]);

  const handleSuccess = () => {
    // We could dispatch user context here, for now just close
    onClose();
  };

  const renderView = () => {
    switch (currentView) {
      case 'signin':
        return <SignInView onSwitchView={setCurrentView} onSuccess={handleSuccess} />;
      case 'signup':
        return <SignUpView onSwitchView={setCurrentView} onSuccess={handleSuccess} />;
      case 'forgot':
        return <ForgotPassView onSwitchView={setCurrentView} />;
      case 'otp':
        return <OtpVerifyView onSwitchView={setCurrentView} />;
      case 'reset':
        return <ResetPassView onSwitchView={setCurrentView} onSuccess={handleSuccess} />;
      default:
        return <SignInView onSwitchView={setCurrentView} onSuccess={handleSuccess} />;
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0F4C3A',
          fontFamily: 'inherit',
          borderRadius: 12,
          colorBgElevated: '#F7F3EA',
        },
      }}
    >
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={480}
        centered
        className="auth-modal"
        styles={{
          mask: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(15, 61, 62, 0.4)' },
          body: { borderRadius: '24px', padding: '24px 12px' }
        }}
      >
        {renderView()}
      </Modal>
    </ConfigProvider>
  );
};
