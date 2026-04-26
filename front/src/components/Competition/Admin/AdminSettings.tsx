import { Card, Button, Text, Badge } from '@/components/UI';
import { cn } from '@/utils';
import toast from 'react-hot-toast';

export const AdminSettings = ({
  competition,
  onUpdate,
  isLoading,
  pendingCount,
}: any) => {
  const isFogActive = competition.fog_of_war || competition.fogOfWar;

  const handleToggleFog = () => {
    onUpdate({ fog_of_war: !isFogActive });
  };

  const handleCloseCompetition = () => {
    if (pendingCount > 0) {
      toast.error(
        `Impossible de clore ! Il reste ${pendingCount} signalement(s) à trancher.`,
        {
          icon: '⚖️',
          style: { borderRadius: '10px', background: '#333', color: '#fff' },
        },
      );
      return;
    }

    if (
      window.confirm(
        '🚩 CONFIRMATION : Terminer la compétition maintenant ? Le classement sera gelé et plus aucun signalement ne sera possible.',
      )
    ) {
      onUpdate({ end_date: new Date().toISOString() });
    }
  };

  return (
    <Card
      variant="dark"
      className="border-gold/30 bg-gold/5 p-6 mb-10 animate-slide-down"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Toggle Brouillard */}
        <div className="flex flex-col items-center lg:items-start gap-3">
          <Text
            variant="caption"
            className="text-gold uppercase font-black text-[10px] tracking-widest"
          >
            Mode Arène
          </Text>
          <Button
            variant={isFogActive ? 'primary' : 'ghost'}
            size="md"
            onClick={handleToggleFog}
            isLoading={isLoading}
            className={cn(
              'w-full sm:w-auto min-w-70 h-20 transition-all duration-500',
              isFogActive ? 'border-gold/50 bg-gold/10' : 'border-white/10',
            )}
          >
            <div className="flex items-center gap-4 text-left w-full">
              {/* Icone avec fond indicatif */}
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner',
                  isFogActive
                    ? 'bg-gold text-black'
                    : 'bg-white/5 text-white/20',
                )}
              >
                {isFogActive ? '🌫️' : '👁️'}
              </div>

              <div className="flex flex-col flex-1">
                <Text
                  variant="h3"
                  className="font-black uppercase text-[11px] leading-none tracking-tight"
                >
                  {isFogActive
                    ? 'Lever le brouillard'
                    : 'Activer le brouillard'}
                </Text>
                <Text
                  variant="body"
                  className="text-[10px] opacity-60 font-normal normal-case italic mt-1 leading-tight"
                >
                  {isFogActive
                    ? 'Rendre les scores visibles par tous'
                    : 'Cacher les scores pour le suspense'}
                </Text>
              </div>

              {/* Petit indicateur d'état type switch */}
              <Badge variant={isFogActive ? 'success' : 'warning'}>
                {isFogActive ? 'ACTIF' : 'OFF'}
              </Badge>
            </div>
          </Button>
        </div>

        {/* Bouton de Clôture */}
        <div className="flex flex-col items-center lg:items-end gap-3 border-t lg:border-t-0 border-white/5 pt-6 lg:pt-0">
          <Text
            variant="caption"
            className="opacity-40 uppercase font-black text-[10px] tracking-widest"
          >
            Fin de partie
          </Text>

          <div className="flex flex-col items-center lg:items-end gap-2">
            <Button
              variant="danger"
              size="md"
              onClick={handleCloseCompetition}
              isLoading={isLoading}
              className={cn(
                'w-full sm:w-auto',
                pendingCount > 0 && 'opacity-50 cursor-not-allowed',
              )}
            >
              🚩 Clore la compétition
            </Button>

            {pendingCount > 0 && (
              <Text
                variant="micro"
                className="text-danger-bright animate-pulse font-bold"
              >
                ⚠️ {pendingCount} actions en attente
              </Text>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
