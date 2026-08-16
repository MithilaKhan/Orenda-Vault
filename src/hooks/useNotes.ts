import { myFetch } from '@/helpers/myFetch';
import { useApiError } from './useApiError';
import toast from 'react-hot-toast';

export const useNotes = () => {
  const { handleApiError } = useApiError();

  const getNotes = async () => {
    try {
      const res = await myFetch("/notes?limit=1000", {
        method: "GET",
      });
      return res; 
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  };

  const createNote = async (values: any) => {
    try {
      const res = await myFetch("/notes", {
        method: "POST",
        body: values,
      });
      return res;
    } catch (error) {
      toast.error("Network error");
      return { success: false, message: "Network error" };
    }
  };

  const updateNote = async (id: string, values: any) => {
    try {
      const res = await myFetch(`/notes/${id}`, {
        method: "PATCH",
        body: values,
      });
      return res;
    } catch (error) {
      toast.error("Network error");
      return { success: false, message: "Network error" };
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const res = await myFetch(`/notes/${id}`, {
        method: "DELETE",
      });
      return res;
    } catch (error) {
      toast.error("Network error");
      return { success: false, message: "Network error" };
    }
  };

  return {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
    handleApiError
  };
};
