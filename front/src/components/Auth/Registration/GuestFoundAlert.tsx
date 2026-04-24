import { Badge, Button, Text } from '@/components/UI';

interface GuestFoundAlertProps {
  foundGuest: any;
  username: string;
  onLink: () => void;
}

export const GuestFoundAlert = ({
  foundGuest,
  username,
  onLink,
}: GuestFoundAlertProps) => (
  <div
    className="flex flex-col items-center gap-2 mt-3 p-4 bg-info/10 border border-info-bright/20 rounded-2xl animate-slide-up"
    role="alert"
  >
    <Text variant="micro" className="text-info-bright text-center opacity-100">
      <span aria-hidden="true">👀 </span> Un blaireau existe déjà
    </Text>

    <Text
      variant="body"
      className="text-white/70 text-[11px] text-center leading-tight"
    >
      Le pseudo{' '}
      <Text variant="mono" as="span" className="text-white text-[11px]">
        @{username}
      </Text>{' '}
      appartient à{' '}
      <span className="text-white font-bold">{foundGuest.name}</span>.
    </Text>

    {foundGuest.last_competition_name ? (
      <div className="flex items-center gap-1 mt-1 overflow-hidden">
        <Text variant="micro" className="italic shrink-0 opacity-20 font-bold">
          Dernier tournoi :
        </Text>
        <Text
          variant="micro"
          className="text-info-bright/60 italic truncate opacity-100"
        >
          {foundGuest.last_competition_name}
        </Text>
      </div>
    ) : (
      <Badge variant="info" className="mt-1 opacity-60">
        Nouveau joueur <span aria-hidden="true">🐣</span>
      </Badge>
    )}

    <Button
      variant="secondary"
      size="sm"
      className="mt-2 w-full border-info-bright/30 hover:bg-info/20 text-info-bright transition-default"
      onClick={onLink}
      type="button"
      aria-label={`Lier le profil existant de ${foundGuest.name} à mon compte`}
    >
      C'est moi, lier ce profil
    </Button>
  </div>
);
