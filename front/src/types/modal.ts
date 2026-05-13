export interface ModalConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'primary' | 'ghost' | 'secondary';
  onConfirm: () => void | Promise<void>;
}
