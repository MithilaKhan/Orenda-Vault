'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  WorkspaceView, 
  Note, 
  Collection, 
  ActivityItem, 
  WorkspaceChatMessage,
  User 
} from '@/types/workspace';
import {  
  INITIAL_CHAT_MESSAGES 
} from '@/constants/defaultData';

export function useWorkspaceStore() {
  const [activeView, setActiveView] = useState<WorkspaceView>('dashboard');
  const [notes, setNotes] = useState<Note[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [chatMessages, setChatMessages] = useState<WorkspaceChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);



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
    setNotes,
    collections,
    setCollections,
    chatMessages,
    setChatMessages,
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
    user,
    setUser,
  };
}

export type WorkspaceStore = ReturnType<typeof useWorkspaceStore>;
