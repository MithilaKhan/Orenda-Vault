import React from 'react';
import { Form, Input, Button } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { AuthView } from '../AuthModal';


interface OtpVerifyViewProps {
  onSwitchView: (view: AuthView) => void;
}

export const OtpVerifyView: React.FC<OtpVerifyViewProps> = ({ onSwitchView }) => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('OTP Code:', values);
    // TODO: Implement actual OTP verify logic
    onSwitchView('reset');
  };

  return (
    <div className="animate-fade-in space-y-6">
      <button 
        onClick={() => onSwitchView('forgot')}
        className="flex items-center text-xs font-semibold text-[#4B5563] hover:text-[#0F4C3A] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
      </button>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[#0f3d3e]">Verify Code</h2>
        <p className="text-[#4B5563] text-sm px-4">
          We've sent a 6-digit verification code to your email.
        </p>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4 pt-2">
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: 'Please input the code!' },
            { len: 6, message: 'Code must be 6 digits' }
          ]}
        >
          <Input 
            size="large" 
            placeholder="000000" 
            maxLength={6}
            className="rounded-xl px-4 py-2 text-center text-lg tracking-[0.5em] font-mono"
          />
        </Form.Item>

        <div className="text-center">
          <button type="button" className="text-xs font-semibold text-[#0F4C3A] hover:underline">
            Didn't receive a code? Resend
          </button>
        </div>

        <Button 
          type="primary" 
          htmlType="submit" 
          block 
          size="large"
          className="bg-[#0F4C3A] hover:bg-[#0F4C3A]/90 h-11 rounded-xl text-sm font-semibold shadow-soft"
        >
          Verify Code
        </Button>
      </Form>
    </div>
  );
};
