import type { ButtonVariant } from '@/components/UI';

export interface ModalConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: ButtonVariant;
  onConfirm: () => void | Promise<void>;
}
