import type { ButtonVariant } from '@/shared/components/UI';
import type { ReactNode } from 'react';
import type React from 'react';

export interface ModalOptions {
  title: string | ReactNode;
  message: string | React.ReactNode;
  confirmLabel?: string;
  variant?: ButtonVariant;
  onConfirm: () => void | Promise<void>;
}

export interface ConfirmModalContextType {
  isOpen: boolean;
  isLoading: boolean;
  options: ModalOptions | null;
  openModal: (options: ModalOptions) => void;
  closeModal: () => void;
  handleConfirm: () => Promise<void>;
}
