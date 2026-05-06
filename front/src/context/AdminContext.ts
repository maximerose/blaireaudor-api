import { createContext, useContext } from 'react';
import type { AdminContextType } from './contextTypes';
import { ERRORS } from '@/constants';

export const AdminContext = createContext<AdminContextType | undefined>(
  undefined,
);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error(
      ERRORS.DEVELOPER.HOOK_OUTSIDE_PROVIDER('useAdmin', 'AdminProvider'),
    );
  }
  return context;
};
