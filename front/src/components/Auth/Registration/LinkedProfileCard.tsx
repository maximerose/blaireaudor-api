import {
  Card,
  Text,
  Button,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  TEXT_VARIANT,
} from '@/components/UI';
import { AUTH_UI } from '@/constants';

interface LinkedProfileCardProps {
  name?: string;
  onClear: () => void;
}

export const LinkedProfileCard = ({
  name,
  onClear,
}: LinkedProfileCardProps) => (
  <Card
    variant="glass"
    role="region"
    aria-label={AUTH_UI.LINKED_CARD.STATUS}
    className="mb-8 p-5 border-success-bright/20 flex justify-between items-center bg-success/5 animate-fade-in"
  >
    <div className="flex flex-col gap-1 text-left">
      <div className="flex items-center gap-2">
        <div
          className="w-1.5 h-1.5 rounded-full bg-success-bright animate-pulse"
          aria-hidden="true"
        />
        <Text
          variant={TEXT_VARIANT.CAPTION}
          className="text-success-bright font-bold uppercase tracking-wider"
        >
          {AUTH_UI.LINKED_CARD.STATUS}
        </Text>
      </div>
      <Text variant={TEXT_VARIANT.H2} className="text-white normal-case">
        {name}
      </Text>
    </div>

    <Button
      variant={BUTTON_VARIANT.GHOST}
      size={BUTTON_SIZE.SMALL}
      type="button"
      onClick={onClear}
      aria-label={`Changer de joueur à lier, actuellement défini sur ${name}`}
      className="transition-default hover:bg-white/10"
    >
      {AUTH_UI.LINKED_CARD.CHANGE_BUTTON}
    </Button>
  </Card>
);
