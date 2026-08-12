import toast from 'react-hot-toast';

export const useApiError = () => {
  const handleApiError = (res: any, toastId: string = 'api-error') => {
    if (res?.error && Array.isArray(res.error)) {
      res.error.forEach((err: { message: string }) => {
        toast.error(err.message, { id: toastId });
      });
    } else {
      toast.error(res?.message || 'An unexpected error occurred', { id: toastId });
    }
  };

  return { handleApiError };
};
