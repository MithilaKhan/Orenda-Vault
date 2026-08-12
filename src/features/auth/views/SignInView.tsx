import React from 'react';
import Image from 'next/image';
import { Form, Input, Button, Divider } from 'antd';
import { Mail, Lock } from 'lucide-react';
import { AuthView } from '../AuthModal';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';


interface SignInViewProps {
  onSwitchView: (view: AuthView) => void;
  onSuccess: () => void;
  setEmailContext: (email: string) => void;
}

export const SignInView: React.FC<SignInViewProps> = ({ onSwitchView, onSuccess, setEmailContext }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const { signIn, handleApiError, handleAuthSuccess } = useAuth();

  const onFinish = async (values: any) => {
    setLoading(true);
    const res = await signIn(values);
    console.log("user login", res)
    setLoading(false);

    if (res?.success) {
      toast.success(res?.message || "Signed in successfully");
      handleAuthSuccess(res);
      form.resetFields();
      onSuccess();
    } else {
      if (res?.message?.toLowerCase().includes("not verified")) {
        setEmailContext(values.email);
        onSwitchView('otp');
      } else {
        handleApiError(res, 'signin');
      }
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
          loading={loading}
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
