import { createContext, useContext } from 'react';
import type { ConfirmModalContextType } from './contextTypes';
import { ERRORS } from '@/constants';

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
