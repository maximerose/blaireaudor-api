import type { ButtonVariant } from '@/shared/components/UI';

export interface ModalOptions {
  title: string;
  message: string;
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
