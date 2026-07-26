'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  WorkspaceView, 
  Note, 
  Collection, 
  ActivityItem, 
  WorkspaceChatMessage 
} from '@/types/workspace';
import { 
  INITIAL_NOTES, 
  INITIAL_COLLECTIONS, 
  INITIAL_ACTIVITIES, 
  INITIAL_CHAT_MESSAGES 
} from '@/constants/defaultData';

const STORAGE_KEY = 'orenda_vault_state_v1';

export function useWorkspaceStore() {
  const [activeView, setActiveView] = useState<WorkspaceView>('dashboard');
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [chatMessages, setChatMessages] = useState<WorkspaceChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.notes) setNotes(parsed.notes);
        if (parsed.collections) setCollections(parsed.collections);
        if (parsed.activities) setActivities(parsed.activities);
        if (parsed.chatMessages) setChatMessages(parsed.chatMessages);
      }
    } catch (e) {
      console.error('Failed to load Orenda Vault state from localStorage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        notes,
        collections,
        activities,
        chatMessages,
      }));
    } catch (e) {
      console.error('Failed to save Orenda Vault state to localStorage:', e);
    }
  }, [notes, collections, activities, chatMessages, isHydrated]);

  const addActivity = useCallback((title: string, type: string, tag: string, targetId?: string) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      title,
      type,
      tag,
      timestamp: Date.now(),
      targetId,
    };
    setActivities(prev => [newAct, ...prev].slice(0, 20)); // keep last 20
  }, []);

  const addNote = useCallback((noteData: {
    title: string;
    content: string;
    summary?: string;
    tags?: string[];
    category?: string;
    collectionId?: string;
  }) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: noteData.title || 'Untitled Note',
      content: noteData.content || '',
      summary: noteData.summary || noteData.content.slice(0, 100) + '...',
      tags: noteData.tags || ['General'],
      category: noteData.category || 'General Notes',
      collectionId: noteData.collectionId,
      isFavorite: false,
      isTrashed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setNotes(prev => [newNote, ...prev]);
    
    // Update collection count if added to collection
    if (noteData.collectionId) {
      setCollections(prev => prev.map(c => c.id === noteData.collectionId ? { ...c, noteCount: c.noteCount + 1 } : c));
    }

    addActivity(newNote.title, 'Created Note', newNote.tags[0] || 'Note', newNote.id);
    return newNote;
  }, [addActivity]);

  const updateNote = useCallback((id: string, partial: Partial<Note>) => {
    setNotes(prev => prev.map(note => {
      if (note.id === id) {
        const updated = { ...note, ...partial, updatedAt: Date.now() };
        if (partial.title || partial.content) {
          addActivity(updated.title, 'Edited Note', updated.tags[0] || 'Note', updated.id);
        }
        return updated;
      }
      return note;
    }));
  }, [addActivity]);

  const toggleFavorite = useCallback((id: string) => {
    setNotes(prev => prev.map(note => {
      if (note.id === id) {
        const nextState = !note.isFavorite;
        addActivity(note.title, nextState ? 'Favorited' : 'Unfavorited', note.tags[0] || 'Note', note.id);
        return { ...note, isFavorite: nextState };
      }
      return note;
    }));
  }, [addActivity]);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.map(note => {
      if (note.id === id) {
        if (!note.isTrashed) {
          addActivity(note.title, 'Moved to Trash', note.tags[0] || 'Trash', note.id);
          return { ...note, isTrashed: true };
        }
      }
      return note;
    }));
  }, [addActivity]);

  const permanentlyDeleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  const restoreNote = useCallback((id: string) => {
    setNotes(prev => prev.map(note => {
      if (note.id === id) {
        addActivity(note.title, 'Restored Note', note.tags[0] || 'Note', note.id);
        return { ...note, isTrashed: false };
      }
      return note;
    }));
  }, [addActivity]);

  const addCollection = useCallback((name: string, description: string = '', icon: string = 'Folder') => {
    const newCol: Collection = {
      id: `col-${Date.now()}`,
      name,
      description,
      icon,
      noteCount: 0,
      createdAt: Date.now(),
    };
    setCollections(prev => [newCol, ...prev]);
    addActivity(name, 'Created Collection', 'Collection', newCol.id);
    return newCol;
  }, [addActivity]);

  const deleteCollection = useCallback((id: string) => {
    setCollections(prev => prev.filter(col => col.id !== id));
  }, []);

  const addChatMessage = useCallback((message: Omit<WorkspaceChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: WorkspaceChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };
    setChatMessages(prev => [...prev, newMsg]);
    return newMsg;
  }, []);

  const clearChatHistory = useCallback(() => {
    setChatMessages(INITIAL_CHAT_MESSAGES);
  }, []);

  return {
    activeView,
    setActiveView,
    notes,
    addNote,
    updateNote,
    toggleFavorite,
    deleteNote,
    permanentlyDeleteNote,
    restoreNote,
    collections,
    addCollection,
    deleteCollection,
    activities,
    addActivity,
    chatMessages,
    addChatMessage,
    clearChatHistory,
    searchQuery,
    setSearchQuery,
    selectedNote,
    setSelectedNote,
    selectedCollectionId,
    setSelectedCollectionId,
    isAiLoading,
    setIsAiLoading,
    isHydrated,
  };
}

export type WorkspaceStore = ReturnType<typeof useWorkspaceStore>;
