import { myFetch } from '@/helpers/myFetch';
import { useApiError } from './useApiError';
import toast from 'react-hot-toast';

export const useCollections = () => {
  const { handleApiError } = useApiError();

  const getCollections = async () => {
    try {
      const res = await myFetch("/collection", {
        method: "GET",
      });
      return res;
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  };

  const createCollection = async (values: any) => {
    try {
      const res = await myFetch("/collection", {
        method: "POST",
        body: values,
      });
      return res;
    } catch (error) {
      toast.error("Network error");
      return { success: false, message: "Network error" };
    }
  };

  const updateCollection = async (id: string, values: any) => {
    try {
      const res = await myFetch(`/collection/${id}`, {
        method: "PATCH",
        body: values,
      });
      return res;
    } catch (error) {
      toast.error("Network error");
      return { success: false, message: "Network error" };
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      const res = await myFetch(`/collection/${id}`, {
        method: "DELETE",
      });
      return res;
    } catch (error) {
      toast.error("Network error");
      return { success: false, message: "Network error" };
    }
  };

  return {
    getCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    handleApiError
  };
};
