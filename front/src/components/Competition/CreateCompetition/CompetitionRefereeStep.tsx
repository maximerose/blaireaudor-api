import {
  Text,
  Button,
  Card,
  Input,
  BUTTON_VARIANT,
  BUTTON_SIZE,
} from '@/components/UI';
import {
  SelectedPlayersList,
  PlayerSearchResultsDropdown,
} from '@/components/Competition';
import { useAuth } from '@/hooks';
import { cn } from '@/utils';
import type {
  CompetitionFormData,
  FormParticipant,
  Player,
  PlayerCompact,
} from '@/types';
import { FORM, ICONS, BUTTONS } from '@/constants';
import { useRefereeStepLogic } from '@/hooks/competition/useRefereeStepLogic';

interface SearchState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searching: boolean;
  results: PlayerCompact[];
}

interface RefereeStepProps {
  formData: CompetitionFormData;
  searchState: SearchState;
  updateField: <K extends keyof CompetitionFormData>(
    field: K,
    value: CompetitionFormData[K],
  ) => void;
  onToggleReferee: (
    person: Player | PlayerCompact | FormParticipant,
    isNew?: boolean,
  ) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}

export const CompetitionRefereeStep = ({
  formData,
  searchState,
  updateField,
  onToggleReferee,
  onBack,
  onSubmit,
  loading,
}: RefereeStepProps) => {
  const { user } = useAuth();
  const { searchTerm, setSearchTerm, searching, results } = searchState;
  const { players, referees, externalReferees, hasNoReferee } =
    useRefereeStepLogic(formData);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center space-y-1">
        <Text variant="h2" className="italic">
          {FORM.COMPETITION.STEPS.REFEREE.TITLE}
        </Text>
        <Text variant="caption" className="opacity-30">
          {FORM.COMPETITION.STEPS.REFEREE.SUBTITLE}
        </Text>
      </div>

      <div className="relative z-10">
        <Input
          align="center"
          placeholder={FORM.COMPETITION.PLACEHOLDERS.EXTERNAL_REFEREE}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          icon={searching ? ICONS.LOADING : ICONS.SEARCH}
        />

        {searchTerm.length >= 1 && (
          <PlayerSearchResultsDropdown
            results={results}
            searchTerm={searchTerm}
            onSelect={(p) => onToggleReferee(p)}
            onCreateNew={(name) => {
              const tempId = `new-ref-${Date.now()}`;
              onToggleReferee({ id: tempId, display_name: name.trim() }, true);
            }}
          />
        )}
      </div>

      <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-2">
          <Text
            variant="micro"
            className="text-gold uppercase tracking-widest pl-1"
          >
            {FORM.COMPETITION.LABELS.MAIN_REFEREE}
          </Text>
          <Card
            variant="dark"
            onClick={() =>
              updateField('isCreatorReferee', !formData.isCreatorReferee)
            }
            className={cn(
              'flex items-center justify-between p-3 cursor-pointer transition-default border',
              formData.isCreatorReferee
                ? 'border-gold bg-gold/10'
                : 'border-white/5 hover:border-white/20',
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm">
                {ICONS.CREATOR}
              </div>
              <Text
                variant="body"
                className={
                  formData.isCreatorReferee
                    ? 'text-gold font-bold'
                    : 'text-white'
                }
              >
                Moi ({user?.player?.display_name})
              </Text>
            </div>
            <div
              className={cn(
                'w-5 h-5 rounded border flex items-center justify-center transition-default',
                formData.isCreatorReferee
                  ? 'bg-gold border-gold text-dark'
                  : 'border-white/20',
              )}
            >
              {formData.isCreatorReferee && (
                <span className="text-xs font-black">{ICONS.CHECK}</span>
              )}
            </div>
          </Card>
        </div>

        {externalReferees.length > 0 && (
          <div className="space-y-2">
            <Text
              variant="micro"
              className="text-white/50 uppercase tracking-widest pl-1"
            >
              {FORM.COMPETITION.LABELS.EXTERNAL_REFEREES}
            </Text>
            <SelectedPlayersList
              participants={externalReferees}
              onRemove={(id) => {
                const person = externalReferees.find((p) => p.id === id);
                if (person) onToggleReferee(person);
              }}
            />
          </div>
        )}

        {players.length > 0 && (
          <div className="space-y-2">
            <Text
              variant="micro"
              className="text-white/50 uppercase tracking-widest pl-1"
            >
              {FORM.COMPETITION.LABELS.PLAYER_REFEREES}
            </Text>
            {players.map((player: FormParticipant) => {
              const isRef = referees.some(
                (r: FormParticipant) => r.id === player.id,
              );
              return (
                <Card
                  key={player.id}
                  variant="dark"
                  onClick={() => onToggleReferee(player)}
                  className={cn(
                    'flex items-center justify-between p-3 cursor-pointer transition-default border',
                    isRef
                      ? 'border-gold bg-gold/10'
                      : 'border-white/5 hover:border-white/20',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm">
                      {isRef ? ICONS.REFEREE : ICONS.PLAYER}
                    </div>
                    <Text
                      variant="body"
                      className={isRef ? 'text-gold font-bold' : 'text-white'}
                    >
                      {player.display_name}
                    </Text>
                  </div>
                  <div
                    className={cn(
                      'w-5 h-5 rounded border flex items-center justify-center transition-default',
                      isRef
                        ? 'bg-gold border-gold text-dark'
                        : 'border-white/20',
                    )}
                  >
                    {isRef && (
                      <span className="text-xs font-black">{ICONS.CHECK}</span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ✨ MESSAGE D'ERREUR SI AUCUN ARBITRE ✨ */}
      {hasNoReferee && (
        <Text
          variant="caption"
          className="text-danger-bright text-center block mt-2 animate-fade-in font-bold"
        >
          {FORM.COMPETITION.HINTS.REFEREE}
        </Text>
      )}

      <div className="flex gap-2 pt-2">
        <Button
          variant={BUTTON_VARIANT.GHOST}
          onClick={onBack}
          disabled={loading}
          className="px-6"
          size={BUTTON_SIZE.MEDIUM}
        >
          {BUTTONS.PREVIOUS}
        </Button>
        {/* ✨ BOUTON DÉSACTIVÉ SI hasNoReferee EST TRUE */}
        <Button
          onClick={onSubmit}
          isLoading={loading}
          disabled={loading || hasNoReferee}
          size="md"
          className="flex-1"
        >
          {FORM.COMPETITION.BUTTONS.CREATE}
        </Button>
      </div>
    </div>
  );
};
