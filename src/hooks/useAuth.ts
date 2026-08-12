import { myFetch } from '@/helpers/myFetch';
import { setCookie } from '@/helpers/cookieHelper';
import { useApiError } from './useApiError';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { handleApiError } = useApiError();

  const signIn = async (values: any) => {
    try {
      const res = await myFetch("/auth/login", {
        method: "POST",
        body: values,
      });
      return res;
    } catch (error) {
      toast.error("Network error");
      return { success: false, message: "Network error" };
    }
  };

  const signUp = async (values: any) => {
    try {
      const res = await myFetch("/user", { 
        method: "POST",
        body: { ...values },
      });
      return res;
    } catch (error) {
      toast.error("Network error");
      return { success: false, message: "Network error" };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await myFetch("/auth/forget-password", {
        method: "POST",
        body: { email },
      });
      return res;
    } catch (error) {
      toast.error("Network error");
      return { success: false, message: "Network error" };
    }
  };

  const verifyEmail = async (email: string, oneTimeCode: number) => {
    try {
      const res = await myFetch("/auth/verify-email", {
        method: "POST",
        body: { email, oneTimeCode },
      });
      return res;
    } catch (error) {
      toast.error("Network error");
      return { success: false, message: "Network error" };
    }
  };

  const resetPassword = async (values: any, token: string) => {
    try {
      const res = await myFetch("/auth/reset-password", {
        method: "POST",
        body: values,
        token: token
      });
      return res;
    } catch (error) {
      toast.error("Network error");
      return { success: false, message: "Network error" };
    }
  };

  const handleAuthSuccess = (res: any) => {
    if (res?.data?.createToken) {
        setCookie('accessToken', res.data.createToken);
    }
  }

  return {
    signIn,
    signUp,
    forgotPassword,
    verifyEmail,
    resetPassword,
    handleApiError,
    handleAuthSuccess
  };
};
