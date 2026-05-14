import {
  Button,
  Text,
  Card,
  BUTTON_VARIANT,
  type ButtonVariant,
  BUTTON_SIZE,
  TEXT_VARIANT,
  CARD_VARIANT,
} from '@/components/UI';
import { BUTTONS } from '@/constants';

const MODAL_OVERLAY =
  'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in';
const MODAL_CARD =
  'w-full max-w-sm p-8 bg-[#161616] border-danger/20 rounded-[2.5rem] space-y-6 animate-slide-up shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmLabel?: string;
  variant?: ButtonVariant;
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
  confirmLabel = BUTTONS.CONFIRM,
  variant = BUTTON_VARIANT.DANGER,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={MODAL_OVERLAY}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={onClose}
    >
      <Card
        variant={CARD_VARIANT.DEFAULT}
        className={MODAL_CARD}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-2">
          <Text
            variant={TEXT_VARIANT.H2}
            id="confirm-modal-title"
            className="italic"
          >
            {title}
          </Text>
          <Text variant={TEXT_VARIANT.BODY} className="text-white/50">
            {message}
          </Text>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant={variant}
            fullWidth
            size={BUTTON_SIZE.LARGE}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
          <Button
            variant={BUTTON_VARIANT.GHOST}
            size={BUTTON_SIZE.SMALL}
            onClick={onClose}
            className="text-white/20 hover:text-white/50 transition-default"
          >
            {BUTTONS.CANCEL}
          </Button>
        </div>
      </Card>
    </div>
  );
};
