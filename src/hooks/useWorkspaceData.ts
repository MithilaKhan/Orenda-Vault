import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNotes } from '@/hooks/useNotes';
import { useCollections } from '@/hooks/useCollections';
import { WorkspaceStore } from '@/store/useWorkspaceStore';
import { Note } from '@/types/workspace';
import { deleteCookie } from '@/helpers/getCookie';
import { removeCookie } from '@/helpers/cookieHelper';

export const useWorkspaceData = (store: WorkspaceStore) => {
  const { getNotes, createNote, updateNote, deleteNote } = useNotes();
  const { getCollections, createCollection, deleteCollection } = useCollections();

  const fetchData = useCallback(async () => {
    let currentNotes: Note[] = [];
    const notesRes = await getNotes();
    if (notesRes?.success) {
      const notesArray = notesRes.data?.data || notesRes.data || [];
      currentNotes = notesArray.map((n: any) => ({
        id: n._id,
        title: n.title,
        content: n.description || '',
        summary: n.description?.slice(0, 100) + '...',
        category: 'General Notes',
        collectionId: n.collection?._id || n.collection,
        isFavorite: n.isFavorite || false,
        isTrashed: false,
        createdAt: n.createdAt ? new Date(n.createdAt).getTime() : Date.now(),
        updatedAt: n.updatedAt ? new Date(n.updatedAt).getTime() : Date.now()
      }));
      store.setNotes(currentNotes);
    }

    const colRes = await getCollections();
    if (colRes?.success) {
      const colArray = colRes.data?.data || colRes.data || [];
      const formattedCols = colArray.map((c: any) => ({
        id: c._id,
        name: c.title,
        description: c.description || '',
        icon: c.icon || 'Folder',
        noteCount: currentNotes.filter(n => n.collectionId === c._id).length,
        createdAt: c.createdAt ? new Date(c.createdAt).getTime() : Date.now(),
      }));
      store.setCollections(formattedCols);
    }
  }, []);

  const handleAddNote = async (noteData: { title: string; content: string; collectionId?: string }) => {
    if (!store.user) {
      toast.error('Please sign in to create notes');
      store.setIsAuthModalOpen(true);
      return;
    }
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
    if (!store.user) {
      toast.error('Please sign in to update notes');
      store.setIsAuthModalOpen(true);
      return;
    }
    const payload: any = {};
    if (partial.title !== undefined) payload.title = partial.title;
    if (partial.content !== undefined) payload.description = partial.content;
    if (partial.collectionId !== undefined) payload.collection = partial.collectionId;
    if (partial.isFavorite !== undefined) payload.isFavorite = partial.isFavorite;

    const res = await updateNote(id, payload);
    if (res?.success) {
      toast.success('Note updated');
      fetchData();
    } else {
      toast.error(res?.message || res?.error || 'Failed to update note');
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!store.user) {
      toast.error('Please sign in to delete notes');
      store.setIsAuthModalOpen(true);
      return;
    }
    const res = await deleteNote(id);
    if (res?.success) {
      toast.success('Note deleted');
      fetchData();
    } else {
      toast.error(res?.message || res?.error || 'Failed to delete note');
    }
  };

  const handleAddCollection = async (name: string, description: string = '', icon: string = 'Folder') => {
    if (!store.user) {
      toast.error('Please sign in to create collections');
      store.setIsAuthModalOpen(true);
      return;
    }
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
    if (!store.user) {
      toast.error('Please sign in to delete collections');
      store.setIsAuthModalOpen(true);
      return;
    }
    const res = await deleteCollection(id);
    if (res?.success) {
      toast.success('Collection deleted');
      fetchData();
    } else {
      toast.error(res?.message || res?.error || 'Failed to delete collection');
    }
  };


  const handleToggleFavorite = async (id: string) => {
    if (!store.user) {
      toast.error('Please sign in to manage favorites');
      store.setIsAuthModalOpen(true);
      return;
    }
    const note = store.notes.find(n => n.id === id);
    if (!note) return;
    const nextFavorite = !note.isFavorite;

    // Optimistic update
    store.setNotes(prev => prev.map(n => n.id === id ? { ...n, isFavorite: nextFavorite } : n));

    const res = await updateNote(id, { isFavorite: nextFavorite });
    if (res?.success) {
      toast.success(nextFavorite ? 'Added to favorites' : 'Removed from favorites');
      fetchData();
    } else {
      toast.error(res?.message || res?.error || 'Failed to toggle favorite');
      // Revert
      store.setNotes(prev => prev.map(n => n.id === id ? { ...n, isFavorite: !nextFavorite } : n));
    }
  };
  const handleRestoreNote = (id: string) => {
    store.setNotes(prev => prev.map(n => n.id === id ? { ...n, isTrashed: false } : n));
  };
  const handlePermanentlyDeleteNote = handleDeleteNote;

  const handleLogout = useCallback(async () => {
    await deleteCookie('accessToken');
    removeCookie('accessToken');
    store.setUser(null);
    store.setNotes([]);
    store.setCollections([]);
    toast.success('Logged out successfully');
    window.location.href = '/';
  }, [store]);

  return {
    fetchData,
    handleAddNote,
    handleUpdateNote,
    handleDeleteNote,
    handleAddCollection,
    handleDeleteCollection,
    handleToggleFavorite,
    handleRestoreNote,
    handlePermanentlyDeleteNote,
    handleLogout
  };
};
