import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Lock } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

export const ChangePasswordTab: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { changePassword } = useProfile();

  const onFinish = async (values: any) => {
    setLoading(true);
    const res = await changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword
    });
    setLoading(false); 
    console.log("change password",res)

    if (res?.success) {
      message.success(res?.message || 'Password updated successfully');
      form.resetFields();
    } else if (res?.message) {
      message.error(res.message);
    }
  };

  return (
    <div className="py-4">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label={<span className="text-sm font-semibold text-gray-700">Current Password</span>}
          name="currentPassword"
          rules={[{ required: true, message: 'Please enter your current password' }]}
        >
          <Input.Password 
            prefix={<Lock className="w-4 h-4 text-gray-400 mr-2" />} 
            className="h-11 rounded-xl text-sm"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-sm font-semibold text-gray-700">New Password</span>}
          name="newPassword"
          rules={[
            { required: true, message: 'Please enter a new password' },
            { min: 8, message: 'Password must be at least 8 characters long' }
          ]}
        >
          <Input.Password 
            prefix={<Lock className="w-4 h-4 text-gray-400 mr-2" />} 
            className="h-11 rounded-xl text-sm"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-sm font-semibold text-gray-700">Confirm New Password</span>}
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The new passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<Lock className="w-4 h-4 text-gray-400 mr-2" />} 
            className="h-11 rounded-xl text-sm"
          />
        </Form.Item>

        <Form.Item className="mt-8 mb-0">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            className="w-full h-12 rounded-xl text-sm font-semibold shadow-none hover:shadow-md transition-shadow bg-[#0F4C3A] hover:bg-[#0F4C3A]/90"
          >
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
