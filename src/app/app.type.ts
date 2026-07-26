import React from 'react';

export interface RootLayoutProps {
  children: React.ReactNode;
}

export interface PageProps {
  params?: Promise<any>;
  searchParams?: Promise<any>;
}
