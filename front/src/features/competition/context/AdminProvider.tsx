import React from 'react';
import type { Competition } from '@/features/competition/types';
import { useAdminSettings } from '@/features/competition/admin';
import { AdminContext } from './AdminContext';

interface AdminProviderProps {
  children: React.ReactNode;
  competition: Competition;
}

export const AdminProvider = ({ children, ...props }: AdminProviderProps) => {
  const value = useAdminSettings(props);

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
