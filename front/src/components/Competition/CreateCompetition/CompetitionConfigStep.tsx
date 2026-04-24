import { Input, Button, Text, Card } from '@/components/UI';
import { cn } from '@/utils';

interface ConfigStepProps {
  formData: any;
  updateField: (field: string, value: any) => void;
  handleJoinCodeChange: (e: any) => void;
  onNext: () => void;
  onGenerateCode: () => void;
  canNext: boolean;
}

export const CompetitionConfigStep = ({
  formData,
  updateField,
  handleJoinCodeChange,
  onGenerateCode,
  onNext,
  canNext,
}: ConfigStepProps) => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center space-y-1">
        <Text variant="h2" className="italic">
          L'Arène
        </Text>
        <Text variant="caption" className="opacity-30">
          Configuration initiale
        </Text>
      </div>

      <div className="space-y-4">
        <Input
          label="Nom"
          placeholder="Nom de la compétition..."
          value={formData.name}
          onChange={(e: any) => updateField('name', e.target.value)}
          required
          align="center"
        />
        <div className="space-y-1">
          <div className="relative flex items-center group">
            <Input
              label="Code d'accès"
              value={formData.joinCode}
              onChange={handleJoinCodeChange}
              align="center"
              placeholder="Ex: BLAIR-2026"
              renderRight={
                <button
                  type="button"
                  onClick={onGenerateCode}
                  className={cn(
                    'flex items-center gap-2 py-1 px-2 rounded-lg',
                    'bg-gold/5 border border-gold/10',
                    'text-gold/60 hover:text-gold transition-all active:scale-95',
                  )}
                >
                  <span className="text-xs font-bold uppercase tracking-tighter">
                    Auto
                  </span>
                  <span className="text-sm">✨</span>
                </button>
              }
            />
          </div>
          {!formData.joinCode && (
            <Text
              variant="micro"
              className="italic opacity-30 text-center block"
            >
              Vide = génération automatique ✨
            </Text>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Début"
            type="date"
            value={formData.startDate}
            onChange={(e: any) => updateField('startDate', e.target.value)}
            required
          />
          <Input
            label="Fin"
            type="date"
            value={formData.endDate}
            onChange={(e: any) => updateField('endDate', e.target.value)}
          />
        </div>

        <div className="space-y-3">
          {[
            {
              id: 'fogOfWar',
              label: 'Brouillard de guerre',
              sub: 'Scores cachés pendant le tournoi',
              active: formData.fogOfWar,
            },
            {
              id: 'participate',
              label: 'Auto-inscription',
              sub: 'Participer au tournoi en tant que joueur',
              active: formData.participate,
            },
          ].map((toggle) => (
            <Card
              key={toggle.id}
              variant="dark"
              role="switch"
              aria-checked={toggle.active}
              aria-label={toggle.label}
              onClick={() => updateField(toggle.id, !toggle.active)}
              className={cn(
                'flex items-center justify-between py-3 px-4 group cursor-pointer transition-default',
                'hover:border-gold/30 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none',
                toggle.active ? 'border-gold/30' : 'border-white/5',
              )}
            >
              <div className="flex flex-col text-left">
                <Text
                  variant="caption"
                  className={cn(
                    'transition-default',
                    toggle.active ? 'text-gold' : 'text-gold/50',
                  )}
                >
                  {toggle.label}
                </Text>
                <Text variant="micro" className="italic mt-1 opacity-20">
                  {toggle.sub}
                </Text>
              </div>
              <div
                aria-hidden="true"
                className={cn(
                  'w-8 h-4 rounded-full relative transition-default',
                  toggle.active ? 'bg-gold' : 'bg-white/10',
                )}
              >
                <div
                  className={cn(
                    'absolute top-0.5 w-3 h-3 bg-dark rounded-full transition-default',
                    toggle.active ? 'left-4.5' : 'left-0.5',
                  )}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Button fullWidth onClick={onNext} disabled={!canNext} size="lg">
        Continuer →
      </Button>
    </div>
  );
};
