import { Card, Text, Button } from '@/components/UI';

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
    aria-label="Profil joueur lié"
    className="mb-8 p-5 border-success-bright/20 flex justify-between items-center bg-success/5 animate-fade-in"
  >
    <div className="flex flex-col gap-1 text-left">
      <div className="flex items-center gap-2">
        <div
          className="w-1.5 h-1.5 rounded-full bg-success-bright animate-pulse"
          aria-hidden="true"
        />
        <Text
          variant="caption"
          className="text-success-bright font-bold uppercase tracking-wider"
        >
          Profil lié
        </Text>
      </div>
      <Text variant="h2" className="text-white normal-case">
        {name}
      </Text>
    </div>

    <Button
      variant="ghost"
      size="sm"
      type="button"
      onClick={onClear}
      aria-label={`Changer de joueur à lier, actuellement défini sur ${name}`}
      className="transition-default hover:bg-white/10"
    >
      Changer
    </Button>
  </Card>
);
