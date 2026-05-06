import React, { useContext } from 'react';
import { AdminContext } from './AdminContext';
import type { AdminContextType } from './types';
import { ERRORS } from '@/constants';

interface AdminProviderProps {
  children: React.ReactNode;
  value: AdminContextType;
}

export const AdminProvider = ({ children, value }: AdminProviderProps) => {
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error(
      ERRORS.DEVELOPER.HOOK_OUTSIDE_PROVIDER('useAdmin', 'AdminProvider'),
    );
  }
  return context;
};
