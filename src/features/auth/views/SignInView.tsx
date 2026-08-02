import React from 'react';
import { Form, Input, Button, Divider } from 'antd';
import { Mail, Lock } from 'lucide-react';
import { AuthView } from '../AuthModal';


interface SignInViewProps {
  onSwitchView: (view: AuthView) => void;
  onSuccess: () => void;
}

export const SignInView: React.FC<SignInViewProps> = ({ onSwitchView, onSuccess }) => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Sign in values:', values);
    // TODO: Implement actual sign in logic
    onSuccess();
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[#0f3d3e]">Welcome back</h2>
        <p className="text-[#4B5563] text-sm">Sign in to your knowledge vault</p>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
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

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password 
            size="large" 
            prefix={<Lock className="w-4 h-4 text-gray-400 mr-2" />} 
            placeholder="Password" 
            className="rounded-xl px-4 py-2 text-sm"
          />
        </Form.Item>

        <div className="flex justify-end -mt-2">
          <button
            type="button"
            onClick={() => onSwitchView('forgot')}
            className="text-xs font-semibold text-[#0F4C3A] hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <Button 
          type="primary" 
          htmlType="submit" 
          block 
          size="large"
          className="bg-[#0F4C3A] hover:bg-[#0F4C3A]/90 h-11 rounded-xl text-sm font-semibold shadow-soft"
        >
          Sign In
        </Button>
      </Form>

      <Divider className="text-xs text-gray-400 font-medium">OR</Divider>

      <div className="text-center text-sm text-[#4B5563]">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => onSwitchView('signup')}
          className="font-semibold text-[#0F4C3A] hover:underline"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};
