import {
  Button,
  Input,
  Card,
  CARD_VARIANT,
  Text,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  TEXT_VARIANT,
  TEXT_THEME,
  preventDefault,
  FORM,
  ICONS,
  BUTTONS,
  Stack,
} from '@/shared';
import { useJoinCompetitionModal } from '@/features/competition/join/hooks';
import { JoinModalHeader } from './JoinModalHeader';

interface Props {
  onClose: () => void;
  onJoined: (code: string) => void;
}

export const JoinCompetitionModal = ({ onClose, onJoined }: Props) => {
  const { code, loading, error, handleSubmit, handleCodeChange } =
    useJoinCompetitionModal(onJoined);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <Card
          variant={CARD_VARIANT.DARK}
          className="w-full shadow-modal-gold border-gold/20"
        >
          <Card.Body p="xl" gap="xl">
            <JoinModalHeader />

            <form onSubmit={preventDefault(handleSubmit)} className="w-full">
              <Stack gap="xl" className="w-full">
                <Stack gap="xs" className="w-full">
                  <Input
                    label={FORM.MODALS.JOIN.INPUT_LABEL}
                    placeholder={FORM.COMPETITION.PLACEHOLDERS.JOIN_CODE}
                    value={code}
                    onChange={handleCodeChange}
                    className="text-center font-mono font-black tracking-[0.2em] text-xl uppercase"
                    autoFocus
                    required
                    align="center"
                    aria-invalid={!!error}
                    aria-describedby={error ? 'join-error' : undefined}
                  />

                  {error && (
                    <Text
                      id="join-error"
                      role="alert"
                      variant={TEXT_VARIANT.MICRO}
                      colorTheme={TEXT_THEME.DANGER}
                      className="text-center animate-pulse flex items-center justify-center gap-1"
                    >
                      <span aria-hidden="true">{ICONS.DANGER}</span> {error}
                    </Text>
                  )}
                </Stack>

                <Stack gap="sm" className="w-full">
                  <Button
                    type="submit"
                    isLoading={loading}
                    fullWidth
                    size={BUTTON_SIZE.MEDIUM}
                  >
                    {FORM.MODALS.JOIN.SUBMIT}
                  </Button>

                  <Button
                    variant={BUTTON_VARIANT.GHOST_NEUTRAL}
                    size={BUTTON_SIZE.SMALL}
                    onClick={onClose}
                    fullWidth
                    aria-label={BUTTONS.CANCEL}
                  >
                    {BUTTONS.CANCEL}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};
