'use client';

import { useState, useCallback } from 'react';
import { 
  WorkspaceView, 
  Note, 
  Collection, 
  WorkspaceChatMessage,
  User 
} from '@/types/workspace';

export function useWorkspaceStore() {
  const [activeView, setActiveView] = useState<WorkspaceView>('dashboard');
  const [notes, setNotes] = useState<Note[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [chatMessages, setChatMessages] = useState<WorkspaceChatMessage[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [paletteInitialQuery, setPaletteInitialQuery] = useState<string>('');

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
    setChatMessages([]);
  }, []);

  const openCommandPalette = useCallback((initialQuery: string = '') => {
    setPaletteInitialQuery(initialQuery);
    setIsCommandPaletteOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(false);
    setPaletteInitialQuery('');
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
    isHistoryLoading,
    setIsHistoryLoading,
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
    isAuthModalOpen,
    setIsAuthModalOpen,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    paletteInitialQuery,
    setPaletteInitialQuery,
    openCommandPalette,
    closeCommandPalette,
  };
}

export type WorkspaceStore = ReturnType<typeof useWorkspaceStore>;
