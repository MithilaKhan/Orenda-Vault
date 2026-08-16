'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useWorkspaceStore, WorkspaceStore } from '@/store/useWorkspaceStore';
import { useWorkspaceData } from '@/hooks/useWorkspaceData';
import { useWorkspaceAI } from '@/hooks/useWorkspaceAI';
import { useWorkspaceViews } from '@/hooks/useWorkspaceViews';
import { usePathname } from 'next/navigation';

export interface WorkspaceContextValue {
  store: WorkspaceStore;
  data: ReturnType<typeof useWorkspaceData>;
  ai: ReturnType<typeof useWorkspaceAI>;
  views: ReturnType<typeof useWorkspaceViews>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useWorkspaceStore();
  const pathname = usePathname();

  const data = useWorkspaceData(store);
  const ai = useWorkspaceAI(store);
  const views = useWorkspaceViews(store);

  // Sync pathname -> store.activeView
  useEffect(() => {
    let view: any = 'dashboard';
    if (pathname === '/notes') view = 'notes';
    else if (pathname === '/collections') view = 'collections';
    else if (pathname === '/favorites') view = 'favorites';
    else if (pathname === '/recent') view = 'recent';
    else if (pathname === '/chat') view = 'chat';

    if (store.activeView !== view) {
      store.setActiveView(view);
    }
  }, [pathname, store]);

  useEffect(() => {
    data.fetchData();
  }, []);

  return (
    <WorkspaceContext.Provider value={{ store, data, ai, views }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
