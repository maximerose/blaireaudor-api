import { BUTTONS } from '@/shared/constants';
import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  type ButtonVariant,
} from './Button';
import { Card, CARD_VARIANT } from './Card';
import { Text, TEXT_VARIANT, TEXT_THEME, type TextTheme } from './Text';
import { Stack } from '../Layout/Stack';
import { cn } from '@/shared/utils';
import type React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  isLoading: boolean;
  title: React.ReactNode;
  message: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
  confirmLabel?: string;
  variant?: ButtonVariant;
  textTheme?: TextTheme;
}

const MODAL_BORDER_COLOR: Record<ButtonVariant, string> = {
  [BUTTON_VARIANT.PRIMARY]: 'border-gold-border',
  [BUTTON_VARIANT.SECONDARY]: 'border-border-base',
  [BUTTON_VARIANT.DANGER]: 'border-danger-border',
  [BUTTON_VARIANT.GHOST]: 'border-border-subtle',
  [BUTTON_VARIANT.GHOST_NEUTRAL]: 'border-border-subtle',
};

export const ConfirmModal = ({
  isOpen,
  isLoading,
  title,
  message,
  onConfirm,
  onClose,
  confirmLabel = BUTTONS.CONFIRM,
  variant = BUTTON_VARIANT.DANGER,
  textTheme = TEXT_THEME.DANGER,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <Card
          variant={CARD_VARIANT.DARK}
          className={cn('shadow-modal border', MODAL_BORDER_COLOR[variant])}
        >
          <Card.Body p="lg" gap="lg">
            <Stack gap="xs" align="center">
              <Text
                variant={TEXT_VARIANT.H2}
                id="confirm-modal-title"
                colorTheme={textTheme}
                className="italic text-center"
              >
                {title}
              </Text>
              <Text
                variant={TEXT_VARIANT.BODY}
                colorTheme={TEXT_THEME.MUTED}
                className="text-center"
              >
                {message}
              </Text>
            </Stack>

            <Stack gap="sm">
              <Button
                variant={variant}
                fullWidth
                size={BUTTON_SIZE.MEDIUM}
                onClick={onConfirm}
                isLoading={isLoading}
                disabled={isLoading}
              >
                {confirmLabel}
              </Button>

              <Button
                variant={BUTTON_VARIANT.GHOST_NEUTRAL}
                size={BUTTON_SIZE.SMALL}
                onClick={onClose}
                disabled={isLoading}
                fullWidth
              >
                {BUTTONS.CANCEL}
              </Button>
            </Stack>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};
