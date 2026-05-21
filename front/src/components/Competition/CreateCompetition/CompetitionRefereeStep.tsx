import {
  Text,
  Button,
  Card,
  Input,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  TEXT_VARIANT,
  CARD_VARIANT,
  SectionHeader,
  SECTION_HEADER_VARIANT,
  FORM,
  cn,
  ICONS,
  BUTTONS,
} from '@/shared';
import {
  SelectedPlayersList,
  PlayerSearchResultsDropdown,
} from '@/components/Competition';
import type { FormParticipant, Player, PlayerCompact } from '@/features/player';
import { useRefereeStepLogic } from '@/hooks';
import { useAuthContext } from '@/features/account';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateCompetitionFormData } from '@/validations';

interface SearchState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searching: boolean;
  results: PlayerCompact[];
}

interface RefereeStepProps {
  formMethods: UseFormReturn<CreateCompetitionFormData>;
  searchState: SearchState;
  onToggleReferee: (
    person: Player | PlayerCompact | FormParticipant,
    isNew?: boolean,
  ) => void;
  onBack: () => void;
  loading: boolean;
}

export const CompetitionRefereeStep = ({
  formMethods,
  searchState,
  onToggleReferee,
  onBack,
  loading,
}: RefereeStepProps) => {
  const { user } = useAuthContext();
  const { searchTerm, setSearchTerm, searching, results } = searchState;
  const {
    watch,
    setValue,
    formState: { errors },
  } = formMethods;

  const isCreatorReferee = watch('isCreatorReferee');
  const { players, referees, externalReferees, hasNoReferee } =
    useRefereeStepLogic(watch());

  const filteredResults = results.filter(
    (result) => !referees.some((r) => String(r.id) === String(result.id)),
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <SectionHeader
        variant={SECTION_HEADER_VARIANT.TITLE}
        as="h1"
        title={FORM.COMPETITION.STEPS.REFEREE.TITLE}
        subtitle={FORM.COMPETITION.STEPS.REFEREE.SUBTITLE}
        centered
      />

      <div className="relative z-10">
        <Input
          align="center"
          placeholder={FORM.COMPETITION.PLACEHOLDERS.EXTERNAL_REFEREE}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={searching ? ICONS.LOADING : ICONS.SEARCH}
        />

        {searchTerm.length >= 1 && (
          <PlayerSearchResultsDropdown
            results={filteredResults}
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
            variant={TEXT_VARIANT.MICRO}
            className="text-gold uppercase tracking-widest pl-1"
          >
            {FORM.COMPETITION.LABELS.MAIN_REFEREE}
          </Text>
          <Card
            variant={CARD_VARIANT.DARK}
            onClick={() =>
              setValue('isCreatorReferee', !isCreatorReferee, {
                shouldValidate: true,
              })
            }
            className={cn(
              'flex items-center justify-between p-3 cursor-pointer transition-default border',
              isCreatorReferee
                ? 'border-gold bg-gold/10'
                : 'border-white/5 hover:border-white/20',
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm">
                {ICONS.CREATOR}
              </div>
              <Text
                variant={TEXT_VARIANT.BODY}
                className={
                  isCreatorReferee ? 'text-gold font-bold' : 'text-white'
                }
              >
                Moi ({user?.player?.display_name})
              </Text>
            </div>
            <div
              className={cn(
                'w-5 h-5 rounded border flex items-center justify-center transition-default',
                isCreatorReferee
                  ? 'bg-gold border-gold text-dark'
                  : 'border-white/20',
              )}
            >
              {isCreatorReferee && (
                <span className="text-xs font-black">{ICONS.CHECK}</span>
              )}
            </div>
          </Card>
        </div>

        {externalReferees.length > 0 && (
          <div className="space-y-2">
            <Text
              variant={TEXT_VARIANT.MICRO}
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
              variant={TEXT_VARIANT.MICRO}
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
                  variant={CARD_VARIANT.DARK}
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
                      variant={TEXT_VARIANT.BODY}
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

      {(hasNoReferee || errors.referees) && (
        <Text
          variant={TEXT_VARIANT.CAPTION}
          className="text-danger-bright text-center block mt-2 animate-fade-in font-bold"
        >
          {errors?.referees?.message || FORM.COMPETITION.HINTS.REFEREE}
        </Text>
      )}

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant={BUTTON_VARIANT.GHOST}
          onClick={onBack}
          disabled={loading}
          className="px-6"
          size={BUTTON_SIZE.MEDIUM}
        >
          {BUTTONS.PREVIOUS}
        </Button>
        <Button
          type="submit"
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
