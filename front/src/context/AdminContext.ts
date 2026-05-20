import { createContext, useContext } from 'react';
import type { AdminContextType } from '@/context';
import { ERRORS } from '@/shared';

export const AdminContext = createContext<AdminContextType | undefined>(
  undefined,
);

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error(
      ERRORS.DEVELOPER.HOOK_OUTSIDE_PROVIDER(
        'useAdminContext',
        'AdminProvider',
      ),
    );
  }
  return context;
};
