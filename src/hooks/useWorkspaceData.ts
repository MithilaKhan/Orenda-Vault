import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNotes } from '@/hooks/useNotes';
import { useCollections } from '@/hooks/useCollections';
import { WorkspaceStore } from '@/store/useWorkspaceStore';
import { Note } from '@/types/workspace';

export const useWorkspaceData = (store: WorkspaceStore) => {
  const { getNotes, createNote, updateNote, deleteNote } = useNotes();
  const { getCollections, createCollection, deleteCollection } = useCollections();

  const fetchData = useCallback(async () => {
    const notesRes = await getNotes();
    if (notesRes?.success) {
      const notesArray = notesRes.data?.data || notesRes.data || [];
      const formattedNotes = notesArray.map((n: any) => ({
        id: n._id,
        title: n.title,
        content: n.description || '',
        summary: n.description?.slice(0, 100) + '...',
        category: 'General Notes',
        collectionId: n.collection?._id || n.collection,
        isFavorite: false,
        isTrashed: false,
        createdAt: n.createdAt ? new Date(n.createdAt).getTime() : Date.now(),
        updatedAt: n.updatedAt ? new Date(n.updatedAt).getTime() : Date.now()
      }));
      store.setNotes(formattedNotes);
    }

    const colRes = await getCollections();
    if (colRes?.success) {
      const colArray = colRes.data?.data || colRes.data || [];
      const formattedCols = colArray.map((c: any) => ({
        id: c._id,
        name: c.title,
        description: c.description || '',
        icon: c.icon || 'Folder',
        noteCount: 0,
        createdAt: c.createdAt ? new Date(c.createdAt).getTime() : Date.now(),
      }));
      store.setCollections(formattedCols);
    }
  }, []);

  const handleAddNote = async (noteData: { title: string; content: string; collectionId?: string }) => {
    const res = await createNote({
      title: noteData.title || 'Untitled Note',
      description: noteData.content || '',
      collection: noteData.collectionId
    });
    if (res?.success) {
      toast.success('Note created');
      fetchData();
    } else {
      toast.error(res?.message || res?.error || 'Failed to create note');
    }
  };

  const handleUpdateNote = async (id: string, partial: Partial<Note>) => {
    const res = await updateNote(id, {
      title: partial.title,
      description: partial.content,
      collection: partial.collectionId
    });
    if (res?.success) {
      toast.success('Note updated');
      fetchData();
    } else {
      toast.error(res?.message || res?.error || 'Failed to update note');
    }
  };

  const handleDeleteNote = async (id: string) => {
    // For now, permanent delete since backend doesn't support trash yet
    const res = await deleteNote(id);
    if (res?.success) {
      toast.success('Note deleted');
      fetchData();
    } else {
      toast.error(res?.message || res?.error || 'Failed to delete note');
    }
  };

  const handleAddCollection = async (name: string, description: string = '', icon: string = 'Folder') => {
    const res = await createCollection({
      title: name,
      description,
      icon
    });
    if (res?.success) {
      toast.success('Collection created');
      fetchData();
    } else {
      toast.error(res?.message || res?.error || 'Failed to create collection');
    }
  };

  const handleDeleteCollection = async (id: string) => {
    const res = await deleteCollection(id);
    if (res?.success) {
      toast.success('Collection deleted');
      fetchData();
    } else {
      toast.error(res?.message || res?.error || 'Failed to delete collection');
    }
  };

  // Dummy implementations for features not yet in backend
  const handleToggleFavorite = (id: string) => {
    store.setNotes(prev => prev.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n));
  };
  const handleRestoreNote = (id: string) => {
    store.setNotes(prev => prev.map(n => n.id === id ? { ...n, isTrashed: false } : n));
  };
  const handlePermanentlyDeleteNote = handleDeleteNote;

  return {
    fetchData,
    handleAddNote,
    handleUpdateNote,
    handleDeleteNote,
    handleAddCollection,
    handleDeleteCollection,
    handleToggleFavorite,
    handleRestoreNote,
    handlePermanentlyDeleteNote
  };
};
