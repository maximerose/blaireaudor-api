import { useCallback, useState, type ReactNode } from 'react';
import { ConfirmModal } from '@/shared/components/UI';
import { ERRORS } from '@/shared/constants';
import type { ModalOptions } from '@/shared/types';
import { ConfirmModalContext } from './ConfirmModalContext';

export const ConfirmModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ModalOptions | null>(null);

  const openModal = useCallback((newOptions: ModalOptions) => {
    setOptions(newOptions);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (isLoading) return;
    setIsOpen(false);
    setOptions(null);
  }, []);

  const handleConfirm = async () => {
    if (!options?.onConfirm) return;

    const result = options.onConfirm();

    if (result instanceof Promise) {
      try {
        setIsLoading(true);
        await result;
      } catch (e) {
        console.error(ERRORS.MODAL.CONFIRM_ERROR, e);
      } finally {
        setIsLoading(false);
      }
    } else {
      closeModal();
    }
  };

  return (
    <ConfirmModalContext.Provider
      value={{
        isOpen,
        isLoading,
        options,
        openModal,
        closeModal,
        handleConfirm,
      }}
    >
      {children}
      <ConfirmModal
        isOpen={isOpen}
        isLoading={isLoading}
        title={options?.title ?? ''}
        message={options?.message ?? ''}
        confirmLabel={options?.confirmLabel}
        variant={options?.variant}
        onConfirm={handleConfirm}
        onClose={closeModal}
      />
    </ConfirmModalContext.Provider>
  );
};
