import { useJoinCompetitionModal } from '@/hooks';
import {
  Button,
  Input,
  Card,
  Text,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  TEXT_VARIANT,
} from '@/components/UI';
import { JoinModalHeader } from '@/components/Competition';
import { preventDefault } from '@/utils';
import { FORM, ICONS, BUTTONS } from '@/constants';

const MODAL_OVERLAY =
  'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in';
const MODAL_CARD =
  'w-full max-w-sm p-8 bg-[#161616] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.1)] border-gold/20 rounded-[2.5rem] space-y-8 animate-slide-up';

interface Props {
  onClose: () => void;
  onJoined: (code: string) => void;
}

export const JoinCompetitionModal = ({ onClose, onJoined }: Props) => {
  const { code, loading, error, handleSubmit, handleCodeChange } =
    useJoinCompetitionModal(onJoined);

  return (
    <div
      className={MODAL_OVERLAY}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <Card variant="default" className={MODAL_CARD}>
        <JoinModalHeader />

        <form onSubmit={preventDefault(handleSubmit)} className="space-y-8">
          <div className="space-y-3">
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
                className="text-danger-bright text-center animate-pulse"
              >
                {ICONS.DANGER} {error}
              </Text>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              isLoading={loading}
              fullWidth
              size={BUTTON_SIZE.LARGE}
              className="transition-default"
            >
              {FORM.MODALS.JOIN.SUBMIT}
            </Button>

            <Button
              variant={BUTTON_VARIANT.GHOST}
              size={BUTTON_SIZE.SMALL}
              onClick={onClose}
              className="text-white/20 hover:text-white/50 transition-default"
              aria-label="Fermer la modale"
            >
              {BUTTONS.CANCEL}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
