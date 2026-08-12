import React from 'react';
import Image from 'next/image';
import { Form, Input, Button } from 'antd';
import { Lock } from 'lucide-react';
import { AuthView } from '../AuthModal';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface ResetPassViewProps {
  onSwitchView: (view: AuthView) => void;
  onSuccess: () => void;
  resetToken: string;
}

export const ResetPassView: React.FC<ResetPassViewProps> = ({ onSwitchView, onSuccess, resetToken }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const { resetPassword, handleApiError } = useAuth();

  const onFinish = async (values: any) => {
    if (!resetToken) {
      toast.error("Reset token is missing. Please try the process again.");
      return;
    }
    setLoading(true);
    const payload = {
      newPassword: values.password,
      confirmPassword: values.confirm,
    };
    const res = await resetPassword(payload, resetToken);
    setLoading(false);

    if (res?.success) {
      toast.success(res?.message || "Password reset successfully");
      form.resetFields();
      onSwitchView('signin');
    } else {
      handleApiError(res, 'reset');
    }
  };

  return (
    <div className="animate-fade-in space-y-6 pt-2">
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-1">
          <span className="inline-flex items-center justify-center overflow-hidden rounded-full" style={{ width: 56, height: 56 }}>
            <Image src="/logo-mockup.png" alt="Orenda AI" width={90} height={90} style={{ objectFit: 'cover', width: 90, height: 90 }} priority />
          </span>
        </div>
        <h2 className="text-2xl font-bold text-[#0f3d3e]">Set New Password</h2>
        <p className="text-[#4B5563] text-sm px-4">
          Please enter your new password below.
        </p>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4 pt-2">
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your new password!' }]}
        >
          <Input.Password 
            size="large" 
            prefix={<Lock className="w-4 h-4 text-gray-400 mr-2" />} 
            placeholder="New Password" 
            className="rounded-xl px-4 py-2 text-sm"
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password 
            size="large" 
            prefix={<Lock className="w-4 h-4 text-gray-400 mr-2" />} 
            placeholder="Confirm Password" 
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
          Reset Password
        </Button>
      </Form>
    </div>
  );
};
