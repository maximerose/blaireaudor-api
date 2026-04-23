import { useCreateCompetitionForm } from '../../hooks/useCreateCompetitionForm';
import { ROUTES } from '../../constants/routes';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { Text } from '../UI/Typography';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { PlayerSearchResultItem } from '../UI/PlayerSearchResultItem';
import { cn } from '../../utils/cn';

interface Props {
  onSuccess: (_competition: any) => void;
}

export const CreateCompetitionView = ({ onSuccess }: Props) => {
  const {
    step,
    setStep,
    formData,
    updateField,
    handleJoinCodeChange,
    players,
    submit,
    loading,
  } = useCreateCompetitionForm(onSuccess);

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in space-y-8">
      <div className="flex justify-between items-center px-1">
        <Button to={ROUTES.NAV_DASHBOARD} variant="ghost" size="sm">
          ← Annuler
        </Button>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-colors',
              step === 1 ? 'bg-gold text-dark' : 'bg-success text-white',
            )}
          >
            {step === 1 ? '1' : '✓'}
          </div>
          <div className="w-4 h-px bg-white/10" />
          <div
            className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-colors',
              step === 2
                ? 'bg-gold text-dark border-gold'
                : 'border-white/10 text-white/20',
            )}
            aria-live="polite"
          >
            2
          </div>
        </div>
      </div>

      {step === 1 ? (
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
            <Input
              label="Code d'accès"
              value={formData.joinCode}
              onChange={handleJoinCodeChange}
              align="center"
              placeholder="EX: BLAIR-2026"
            />

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
                  onClick={() => updateField(toggle.id as any, !toggle.active)}
                  className={cn(
                    'flex items-center justify-between py-3 px-4 group cursor-pointer transition-all',
                    'hover:border-gold/30 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none',
                    toggle.active ? 'border-gold/30' : 'border-white/5',
                  )}
                >
                  <div className="flex flex-col text-left">
                    <Text
                      variant="caption"
                      className={cn(
                        'transition-colors',
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
                      'w-8 h-4 rounded-full relative transition-colors',
                      toggle.active ? 'bg-gold' : 'bg-white/10',
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-0.5 w-3 h-3 bg-dark rounded-full transition-all',
                        toggle.active ? 'left-4.5' : 'left-0.5',
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Button
            fullWidth
            onClick={() => setStep(2)}
            disabled={!formData.name || !formData.startDate}
            size="lg"
          >
            Continuer →
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-slide-up">
          <div className="text-center">
            <Text variant="h2" className="italic">
              Recrutement
            </Text>
          </div>

          <div className="relative">
            <Input
              autoFocus
              align="left"
              placeholder="Chercher ou créer un joueur..."
              value={players.searchTerm}
              onChange={(e: any) => {
                players.setSearchTerm(e.target.value);
                players.search(e.target.value);
              }}
              icon={players.searching ? '⏳' : '🔍'}
            />

            {players.searchTerm.length >= 1 && (
              <Card
                variant="dark"
                className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden border-gold/30 bg-black/95 backdrop-blur-xl shadow-2xl max-h-64 overflow-y-auto no-scrollbar"
              >
                <div
                  onClick={() => players.addNew(players.searchTerm)}
                  className="p-4 border-b border-white/10 bg-gold/5 hover:bg-gold/10 cursor-pointer flex justify-between items-center group"
                >
                  <div className="flex flex-col text-left">
                    <Text variant="micro" className="text-gold opacity-100">
                      Créer le profil "{players.searchTerm}"
                    </Text>
                    <Text variant="micro" className="italic opacity-30">
                      Nouveau joueur
                    </Text>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-gold/20 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                    +
                  </div>
                </div>

                {players.results.map((p: any) => (
                  <PlayerSearchResultItem
                    key={p.id}
                    player={p}
                    onClick={players.add}
                    actionIcon="+"
                  />
                ))}
              </Card>
            )}
          </div>

          <div
            className={cn(
              'flex flex-wrap gap-2 p-4 rounded-2xl border min-h-24 items-start transition-colors',
              formData.players.length > 0
                ? 'bg-gold/5 border-gold/20 border-solid'
                : 'border-dashed border-white/10',
            )}
          >
            {formData.players.length > 0 ? (
              formData.players.map((p: any) => (
                <Badge
                  key={p.id}
                  variant="gold"
                  className="pl-3 pr-2 py-1 flex items-center gap-2 animate-fade-in"
                >
                  {p.display_name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      players.remove(p.id);
                    }}
                    aria-label={`Supprime ${p.display_name} de la liste`}
                    className="text-gold/40 hover:text-danger-bright transition-colors text-[11px]"
                  >
                    ✕
                  </button>
                </Badge>
              ))
            ) : (
              <Text variant="micro" className="m-auto opacity-20">
                Aucun joueur pour le moment
              </Text>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(1)} className="px-6">
              Précédent
            </Button>
            <Button fullWidth onClick={submit} isLoading={loading} size="lg">
              Créer l'arène
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
