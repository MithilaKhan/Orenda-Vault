import React from 'react';
import Image from 'next/image';
import { Form, Input, Button, Divider } from 'antd';
import { Mail, Lock, User } from 'lucide-react';
import { AuthView } from '../AuthModal';
import { myFetch } from '@/helpers/myFetch';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
interface SignUpViewProps {
  onSwitchView: (view: AuthView) => void;
  onSuccess: () => void;
  setEmailContext: (email: string) => void;
  setOtpContext: (otp: string) => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({ onSwitchView, onSuccess, setEmailContext, setOtpContext }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const { signUp, handleApiError } = useAuth();

  const onFinish = async (values: any) => {
    setLoading(true);
    const res = await signUp(values);
    setLoading(false);
    console.log("user register", res)

    if (res?.success) {
      toast.success(res?.message || "Registered successfully", { id: "register" });
      setEmailContext(values.email);
      if (res?.data?.otp) {
        setOtpContext(String(res.data.otp));
      }
      form.resetFields();
      onSwitchView("otp");
    } else {
      handleApiError(res, "register");
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-1">
          <span className="inline-flex items-center justify-center overflow-hidden rounded-full" style={{ width: 56, height: 56 }}>
            <Image src="/logo-mockup.png" alt="Orenda AI" width={90} height={90} style={{ objectFit: 'cover', width: 90, height: 90 }} priority />
          </span>
        </div>
        <h2 className="text-2xl font-bold text-[#0f3d3e]">Create Account</h2>
        <p className="text-[#4B5563] text-sm">Join your knowledge sanctuary</p>
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
          loading={loading}
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
