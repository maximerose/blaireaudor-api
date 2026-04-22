import React from 'react';
import { Link } from 'react-router-dom';
import { useCreateCompetitionForm } from '../../hooks/useCreateCompetitionForm';
import { ROUTES } from '../../constants/routes';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { Text } from '../UI/Typography';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { PlayerSearchResultItem } from '../UI/PlayerSearchResultItem';

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
      <div className="flex justify-between items-center">
        <Button as={Link} to={ROUTES.NAV_DASHBOARD} variant="ghost" size="sm">
          ← Annuler
        </Button>
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${step === 1 ? 'bg-gold text-dark' : 'bg-success text-white'}`}
          >
            {step === 1 ? '1' : '✓'}
          </div>
          <div className="w-4 h-px bg-white/10" />
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border ${step === 2 ? 'bg-gold text-dark border-gold' : 'border-white/10 text-white/20'}`}
          >
            2
          </div>
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-6 animate-slide-up">
          <div className="text-center">
            <Text variant="h2" className="italic lowercase">
              L'Arène
            </Text>
            <Text variant="caption" className="opacity-30 tracking-[0.2em]">
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
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Début"
                type="date"
                value={formData.startDate}
                onChange={(e: any) => updateField('startDate', e.target.value)}
                required
                align="center"
              />
              <Input
                label="Fin"
                type="date"
                value={formData.endDate}
                onChange={(e: any) => updateField('endDate', e.target.value)}
                align="center"
              />
            </div>

            <Card
              variant="dark"
              onClick={() => updateField('fogOfWar', !formData.fogOfWar)}
              className="flex items-center justify-between py-2 px-4"
            >
              <div className="flex flex-col text-left">
                <Text variant="caption" className="text-gold">
                  Brouillard de guerre
                </Text>
                <span className="text-[9px] text-white/20 italic leading-none mt-1">
                  Scores cachés pendant le tournoi
                </span>
              </div>
              <div
                className={`w-8 h-4 rounded-full relative transition-colors ${formData.fogOfWar ? 'bg-gold' : 'bg-white/10'}`}
              >
                <div
                  className={`absolute top-0.5 w-3 h-3 bg-dark rounded-full transition-all ${formData.fogOfWar ? 'left-4.5' : 'left-0.5'}`}
                />
              </div>
            </Card>

            <Card
              variant="dark"
              onClick={() => updateField('participate', !formData.participate)}
              className="flex items-center justify-between py-2 px-4"
            >
              <div className="flex flex-col text-left">
                <Text variant="caption" className="text-gold">
                  Auto-inscription
                </Text>
                <span className="text-[9px] text-white/20 italic leading-none mt-1">
                  Participer au tournoi
                </span>
              </div>
              <div
                className={`w-8 h-4 rounded-full relative transition-colors ${formData.participate ? 'bg-gold' : 'bg-white/10'}`}
              >
                <div
                  className={`absolute top-0.5 w-3 h-3 bg-dark rounded-full transition-all ${formData.participate ? 'left-4.5' : 'left-0.5'}`}
                />
              </div>
            </Card>
          </div>

          <Button
            fullWidth
            onClick={() => setStep(2)}
            disabled={!formData.name || !formData.startDate}
          >
            Continuer →
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-slide-up">
          <div className="text-center">
            <Text variant="h2" className="italic lowercase">
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
              <div className="absolute top-full left-0 right-0 mt-1 z-50">
                <Card
                  variant="dark"
                  className="overflow-hidden border-gold/20 shadow-2xl bg-black/95 max-h-64 overflow-y-auto no-scrollbar"
                >
                  <div
                    onClick={() => players.addNew(players.searchTerm)}
                    className="p-4 border-b border-white/10 bg-gold/5 hover:bg-gold/10 cursor-pointer flex justify-between items-center group"
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-gold font-black uppercase">
                        Créer le profil "{players.searchTerm}"
                      </span>
                      <span className="text-[8px] text-white/30 italic">
                        Nouveau joueur
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded-full border border-gold/20 flex items-center justify-center text-gold">
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
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 p-4 rounded-2xl border border-dashed border-white/10 min-h-20 items-start">
            {formData.players.map((p: any) => (
              <Badge
                key={p.id}
                variant="gold"
                className="pl-3 pr-1.5 py-1 rounded-full flex items-center gap-2"
              >
                <span className="text-[9px] font-black uppercase">
                  {p.display_name}
                </span>
                <button
                  onClick={() => players.remove(p.id)}
                  className="text-gold/40 hover:text-danger-bright"
                >
                  ✕
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Précédent
            </Button>
            <Button fullWidth onClick={submit} isLoading={loading}>
              Créer l'arène
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
