import type { ModalConfig } from '@/types';
import { useCallback, useState, type ReactNode } from 'react';
import { ConfirmModalContext } from './ConfirmModalContext';
import { ConfirmModal } from '@/components/UI';

export const ConfirmModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ModalConfig | null>(null);

  const openModal = useCallback((newConfig: ModalConfig) => {
    setConfig(newConfig);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConfirm = async () => {
    if (config?.onConfirm) {
      await config.onConfirm();
    }
    close();
  };

  return (
    <ConfirmModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ConfirmModal
        isOpen={isOpen}
        title={config?.title ?? ''}
        message={config?.message ?? ''}
        confirmLabel={config?.confirmLabel}
        variant={config?.variant}
        onConfirm={handleConfirm}
        onClose={closeModal}
      />
    </ConfirmModalContext.Provider>
  );
};
