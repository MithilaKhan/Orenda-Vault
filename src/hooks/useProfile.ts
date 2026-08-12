import { myFetch } from '@/helpers/myFetch';
import { useApiError } from './useApiError';
import toast from 'react-hot-toast';

export const useProfile = () => {
  const { handleApiError } = useApiError();

  const getProfile = async () => {
    try {
      const res = await myFetch("/user/profile", {
        method: "GET",
      });
      return res;
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  };

  const updateProfile = async (values: any, imageFile?: File) => {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(values));
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await myFetch("/user/profile", {
        method: "PATCH",
        body: formData,
      });
      return res;
    } catch (error) {
      toast.error("Network error");
      return { success: false, message: "Network error" };
    }
  };

  const changePassword = async (values: any) => {
    try {
      const res = await myFetch("/auth/change-password", {
        method: "POST",
        body: values,
      });
      return res;
    } catch (error) {
      toast.error("Network error");
      return { success: false, message: "Network error" };
    }
  };

  return {
    getProfile,
    updateProfile,
    changePassword,
    handleApiError
  };
};
