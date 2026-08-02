import React from 'react';
import { Form, Input, Button, Divider } from 'antd';
import { Mail, Lock, User } from 'lucide-react';
import { AuthView } from '../AuthModal';

interface SignUpViewProps {
  onSwitchView: (view: AuthView) => void;
  onSuccess: () => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({ onSwitchView, onSuccess }) => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Sign up values:', values);
    // TODO: Implement actual sign up logic
    onSuccess();
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[#0f3d3e]">Create Account</h2>
        <p className="text-[#4B5563] text-sm">Join the knowledge sanctuary</p>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input 
            size="large" 
            prefix={<User className="w-4 h-4 text-gray-400 mr-2" />} 
            placeholder="Full Name" 
            className="rounded-xl px-4 py-2 text-sm"
          />
        </Form.Item>

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

        <Button 
          type="primary" 
          htmlType="submit" 
          block 
          size="large"
          className="bg-[#0F4C3A] hover:bg-[#0F4C3A]/90 h-11 rounded-xl text-sm font-semibold shadow-soft mt-2"
        >
          Sign Up
        </Button>
      </Form>

      <Divider className="text-xs text-gray-400 font-medium">OR</Divider>

      <div className="text-center text-sm text-[#4B5563]">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => onSwitchView('signin')}
          className="font-semibold text-[#0F4C3A] hover:underline"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};
