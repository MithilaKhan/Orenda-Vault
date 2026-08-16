import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { User as UserIcon, Mail, Upload as UploadIcon } from 'lucide-react';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useProfile } from '@/hooks/useProfile';
import { resolveImageUrl } from '@/helpers/resolveImageUrl';
import { User } from '@/shared/shared.type';

interface EditProfileFormValues {
  name: string;
  email: string;
}

interface EditProfileTabProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const EditProfileTab: React.FC<EditProfileTabProps> = ({ user, setUser }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<RcFile | undefined>();
  
  const { updateProfile, getProfile } = useProfile(); 
console.log("user profile",user)

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
      });
      if (user.image) {
        setImageUrl(resolveImageUrl(user.image));
      }
    }
  }, [user, form]);


  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    const file = info.file.originFileObj as RcFile;
    if (file) {
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const onFinish = async (values: EditProfileFormValues) => {
    setLoading(true);
    const res = await updateProfile(values, selectedFile);
    setLoading(false);

    if (res?.success) {
      message.success(res?.message || 'Profile updated successfully');
      const updatedProfileRes = await getProfile();
      if (updatedProfileRes?.success && updatedProfileRes.data) {
        setUser(updatedProfileRes.data);
      }
    }
  };

  return (
    <div className="py-4">
      <div className="flex flex-col items-center mb-8">
        <Upload
          name="avatar"
          listType="picture-circle"
          className="avatar-uploader"
          showUploadList={false}
          onChange={handleChange}
        >
          <img
            src={imageUrl || '/default-avatar.svg'}
            alt="avatar"
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/default-avatar.svg';
            }}
          />
        </Upload>
        <p className="text-xs text-gray-500 mt-3 font-medium">Click to upload new picture</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label={<span className="text-sm font-semibold text-gray-700">Full Name</span>}
          name="name"
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input 
            prefix={<UserIcon className="w-4 h-4 text-gray-400 mr-2" />} 
            className="h-11 rounded-xl text-sm"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-sm font-semibold text-gray-700">Email Address</span>}
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input 
            prefix={<Mail className="w-4 h-4 text-gray-400 mr-2" />} 
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
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
