import { createContext, useContext } from 'react';
import { ERRORS } from '@/constants';
import type { ActionTableContextType } from '@/context';

export const ActionTableContext = createContext<
  ActionTableContextType | undefined
>(undefined);

export const useActionTableContext = () => {
  const context = useContext(ActionTableContext);
  if (context === undefined) {
    throw new Error(
      ERRORS.DEVELOPER.HOOK_OUTSIDE_PROVIDER(
        'useActionTableContext',
        'ActionTableProvider',
      ),
    );
  }
  return context;
};
