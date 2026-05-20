import { createContext, useContext } from 'react';
import type { ConfirmModalContextType } from '@/shared/types';
import { ERRORS } from '@/shared/constants';

export const ConfirmModalContext =
  createContext<ConfirmModalContextType | null>(null);

export const useConfirmModal = () => {
  const context = useContext(ConfirmModalContext);
  if (!context) {
    throw new Error(
      ERRORS.DEVELOPER.HOOK_OUTSIDE_PROVIDER(
        'useConfirmModal',
        'ConfirmModalProvider',
      ),
    );
  }
  return context;
};
