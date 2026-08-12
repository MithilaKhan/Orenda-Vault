import React from 'react';
import Image from 'next/image';
import { Form, Input, Button } from 'antd';
import { Mail, ArrowLeft } from 'lucide-react';
import { AuthView } from '../AuthModal';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface ForgotPassViewProps {
  onSwitchView: (view: AuthView) => void;
  setEmailContext: (email: string) => void;
}

export const ForgotPassView: React.FC<ForgotPassViewProps> = ({ onSwitchView, setEmailContext }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const { forgotPassword, handleApiError } = useAuth();

  const onFinish = async (values: any) => {
    setLoading(true);
    const res = await forgotPassword(values.email);
    setLoading(false);

    if (res?.success) {
      toast.success(res?.message || "Reset code sent to your email");
      setEmailContext(values.email);
      form.resetFields();
      onSwitchView('otp');
    } else {
      handleApiError(res, 'forgot-password');
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <button 
        onClick={() => onSwitchView('signin')}
        className="flex items-center text-xs font-semibold text-[#4B5563] hover:text-[#0F4C3A] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Sign In
      </button>

      <div className="text-center space-y-3">
        <div className="flex justify-center mb-1">
          <span className="inline-flex items-center justify-center overflow-hidden rounded-full" style={{ width: 56, height: 56 }}>
            <Image src="/logo-mockup.png" alt="Orenda AI" width={90} height={90} style={{ objectFit: 'cover', width: 90, height: 90 }} priority />
          </span>
        </div>
        <h2 className="text-2xl font-bold text-[#0f3d3e]">Forgot Password?</h2>
        <p className="text-[#4B5563] text-sm px-4">
          Enter your email address and we'll send you a code to reset your password.
        </p>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4 pt-2">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input 
            size="large" 
            prefix={<Mail className="w-4 h-4 text-gray-400 mr-2" />} 
            placeholder="Email address" 
            className="rounded-xl px-4 py-2 text-sm"
          />
        </Form.Item>

        <Button 
          type="primary" 
          htmlType="submit" 
          block 
          size="large"
          loading={loading}
          className="bg-[#0F4C3A] hover:bg-[#0F4C3A]/90 h-11 rounded-xl text-sm font-semibold shadow-soft"
        >
          Send Reset Code
        </Button>
      </Form>
    </div>
  );
};
