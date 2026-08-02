import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Avatar } from 'antd';
import { User, Mail, Upload as UploadIcon } from 'lucide-react';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

interface EditProfileFormValues {
  fullName: string;
  email: string;
}

export const EditProfileTab: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const onFinish = (values: EditProfileFormValues) => {
    console.log('Success:', values);
    message.success('Profile updated successfully');
  };

  return (
    <div className="py-4">
      <div className="flex flex-col items-center mb-8">
        <Upload
          name="avatar"
          listType="picture-circle"
          className="avatar-uploader"
          showUploadList={false}
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <UploadIcon className="w-6 h-6 mb-2" />
              <div className="text-xs">Upload</div>
            </div>
          )}
        </Upload>
        <p className="text-xs text-gray-500 mt-3 font-medium">Click to upload new picture</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          fullName: 'Mithila Khan',
          email: 'mithila@example.com'
        }}
      >
        <Form.Item
          label={<span className="text-sm font-semibold text-gray-700">Full Name</span>}
          name="fullName"
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input 
            prefix={<User className="w-4 h-4 text-gray-400 mr-2" />} 
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
            className="w-full h-12 rounded-xl text-sm font-semibold shadow-none hover:shadow-md transition-shadow"
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
