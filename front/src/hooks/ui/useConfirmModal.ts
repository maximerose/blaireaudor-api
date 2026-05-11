import { useState } from 'react';

export interface ModalConfig {
  title: string;
  message: string;
  onConfirm: () => void;
  confirmLabel?: string;
}

export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ModalConfig | null>(null);

  const open = (cfg: ModalConfig) => {
    setConfig(cfg);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setConfig(null);
  };

  const confirm = () => {
    config?.onConfirm();
    close();
  };

  return { isOpen, config, open, close, confirm };
};
