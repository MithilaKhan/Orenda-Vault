import React from 'react';
import Image from 'next/image';
import { Form, Input, Button } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { AuthView } from '../AuthModal';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';


interface OtpVerifyViewProps {
  onSwitchView: (view: AuthView) => void;
  onSuccess: () => void;
  emailContext: string;
  setResetToken: (token: string) => void;
  otpContext?: string;
}

export const OtpVerifyView: React.FC<OtpVerifyViewProps> = ({ onSwitchView, onSuccess, emailContext, setResetToken, otpContext }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [resendLoading, setResendLoading] = React.useState(false);
  const { verifyEmail, forgotPassword, handleApiError } = useAuth();

  // Auto-fill OTP when provided from backend (dev mode)
  React.useEffect(() => {
    if (otpContext) {
      form.setFieldsValue({ otp: otpContext });
    }
  }, [otpContext, form]);

  const onFinish = async (values: any) => {
    if (!emailContext) {
      toast.error("Email context is missing. Please try again.");
      return;
    }
    setLoading(true);
    const res = await verifyEmail(emailContext, Number(values.otp));
    setLoading(false);

    if (res?.success) {
      toast.success(res?.message || "Verified successfully");
      form.resetFields();
      if (res?.data) {
        setResetToken(res.data);
        onSwitchView('reset');
      } else {
        onSwitchView('signin');
      }
    } else {
      handleApiError(res, 'otp');
    }
  };

  const handleResend = async () => {
    if (!emailContext) {
      toast.error("Email context is missing.");
      return;
    }
    setResendLoading(true);
    const res = await forgotPassword(emailContext);
    setResendLoading(false);

    if (res?.success) {
      toast.success(res?.message || "Reset code resent to your email");
    } else {
      handleApiError(res, 'resend-otp');
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <button 
        onClick={() => onSwitchView('forgot')}
        className="flex items-center text-xs font-semibold text-[#4B5563] hover:text-[#0F4C3A] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
      </button>

      <div className="text-center space-y-3">
        <div className="flex justify-center mb-1">
          <span className="inline-flex items-center justify-center overflow-hidden rounded-full" style={{ width: 56, height: 56 }}>
            <Image src="/logo-mockup.png" alt="Orenda AI" width={90} height={90} style={{ objectFit: 'cover', width: 90, height: 90 }} priority />
          </span>
        </div>
        <h2 className="text-2xl font-bold text-[#0f3d3e]">Verify Code</h2>
        <p className="text-[#4B5563] text-sm px-4">
          We've sent a 4-digit verification code to your email.
        </p>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4 pt-2">
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: 'Please input the code!' },
            { len: 4, message: 'Code must be 4 digits' }
          ]}
        >
          <Input 
            size="large" 
            placeholder="0000" 
            maxLength={4}
            className="rounded-xl px-4 py-2 text-center text-lg tracking-[0.5em] font-mono"
          />
        </Form.Item>

        <div className="text-center">
          <button 
            type="button" 
            onClick={handleResend}
            disabled={resendLoading}
            className="text-xs font-semibold text-[#0F4C3A] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading ? 'Resending...' : "Didn't receive a code? Resend"}
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
          Verify Code
        </Button>
      </Form>
    </div>
  );
};
