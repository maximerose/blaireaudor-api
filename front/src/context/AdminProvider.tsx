import React from 'react';
import { AdminContext } from './AdminContext';
import { useAdminSettings } from '@/hooks';
import type { Competition, Action } from '@/types';

interface AdminProviderProps {
  children: React.ReactNode;
  competition: Competition;
  actions: Action[];
  refresh: () => void;
}

export const AdminProvider = ({ children, ...props }: AdminProviderProps) => {
  const value = useAdminSettings(props);

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
