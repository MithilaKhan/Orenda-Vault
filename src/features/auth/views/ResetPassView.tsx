import React from 'react';
import { Form, Input, Button } from 'antd';
import { Lock } from 'lucide-react';
import { AuthView } from '../AuthModal';

interface ResetPassViewProps {
  onSwitchView: (view: AuthView) => void;
  onSuccess: () => void;
}

export const ResetPassView: React.FC<ResetPassViewProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Reset password values:', values);
    // TODO: Implement actual reset password logic
    onSuccess(); // After resetting, maybe sign them in or close modal
  };

  return (
    <div className="animate-fade-in space-y-6 pt-2">
      <div className="text-center space-y-2">
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
          className="bg-[#0F4C3A] hover:bg-[#0F4C3A]/90 h-11 rounded-xl text-sm font-semibold shadow-soft"
        >
          Reset Password
        </Button>
      </Form>
    </div>
  );
};
