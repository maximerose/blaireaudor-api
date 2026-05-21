import React from 'react';
import {
  AdminContext,
  useAdminSettings,
  type Competition,
} from '@/features/competition';

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
