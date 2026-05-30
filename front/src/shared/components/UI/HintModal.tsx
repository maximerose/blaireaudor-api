import {
  Button,
  BUTTON_VARIANT,
  BUTTONS,
  Card,
  CARD_VARIANT,
  Text,
  TEXT_THEME,
  TEXT_VARIANT,
} from '@/shared';

interface HintModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export const HintModal = ({
  isOpen,
  title,
  description,
  onClose,
}: HintModalProps) => {
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
          className="shadow-modal-info border-info/50"
        >
          <Card.Body p="lg" gap="md" align="center">
            <Text
              variant={TEXT_VARIANT.H2}
              colorTheme={TEXT_THEME.INFO}
              className="italic text-center"
            >
              {title}
            </Text>
            <Text
              variant={TEXT_VARIANT.BODY}
              colorTheme={TEXT_THEME.MUTED}
              className="text-center text-md leading-relaxed"
            >
              {description}
            </Text>
            <Button
              fullWidth
              variant={BUTTON_VARIANT.SECONDARY}
              onClick={onClose}
              className="mt-2"
            >
              {BUTTONS.CLOSE}
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};
