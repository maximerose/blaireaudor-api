import {
  Text,
  Button,
  Card,
  Input,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  TEXT_VARIANT,
  TEXT_THEME,
  CARD_VARIANT,
  SectionHeader,
  SECTION_HEADER_VARIANT,
  FORM,
  cn,
  ICONS,
  BUTTONS,
  Stack,
  Row,
  UI,
} from '@/shared';
import type { FormParticipant, Player, PlayerCompact } from '@/features/player';
import { useAuthContext } from '@/features/account';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateCompetitionFormData } from '@/features/competition/validations';
import { useRefereeStepLogic } from '@/features/competition/create/hooks';
import {
  PlayerSearchResultsDropdown,
  SelectedPlayersList,
} from '@/features/competition/enrollment';

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
    (result) =>
      !referees.some(
        (r: FormParticipant) => String(r.id) === String(result.id),
      ),
  );

  return (
    <Stack gap="xl" className="animate-slide-up w-full">
      <SectionHeader
        variant={SECTION_HEADER_VARIANT.TITLE}
        as="h1"
        title={FORM.COMPETITION.STEPS.REFEREE.TITLE}
        subtitle={FORM.COMPETITION.STEPS.REFEREE.SUBTITLE}
        centered
      />

      <Stack gap="md" className="w-full">
        <div className="relative z-10 w-full">
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
                onToggleReferee(
                  { id: tempId, display_name: name.trim() },
                  true,
                );
              }}
            />
          )}
        </div>

        <Stack
          gap="sm"
          className="max-h-60 overflow-y-auto pr-2 custom-scrollbar w-full"
        >
          <Stack gap="xs" className="w-full">
            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={TEXT_THEME.GOLD}
              className="uppercase tracking-widest pl-1"
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
              <Row align="center" gap="sm">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm shrink-0">
                  {ICONS.CREATOR}
                </div>
                <Text
                  variant={TEXT_VARIANT.BODY}
                  colorTheme={
                    isCreatorReferee ? TEXT_THEME.GOLD : TEXT_THEME.DEFAULT
                  }
                  className={isCreatorReferee ? 'font-bold' : ''}
                >
                  {UI.ME} ({user?.player?.display_name})
                </Text>
              </Row>
              <div
                className={cn(
                  'w-5 h-5 rounded border flex items-center justify-center transition-default shrink-0',
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
          </Stack>

          {externalReferees.length > 0 && (
            <Stack gap="xs" className="w-full">
              <Text
                variant={TEXT_VARIANT.MICRO}
                colorTheme={TEXT_THEME.DIMMED}
                className="uppercase tracking-widest pl-1"
              >
                {FORM.COMPETITION.LABELS.EXTERNAL_REFEREES}
              </Text>
              <SelectedPlayersList
                participants={externalReferees}
                onRemove={(id) => {
                  const person = externalReferees.find(
                    (p: FormParticipant) => p.id === id,
                  );
                  if (person) onToggleReferee(person);
                }}
              />
            </Stack>
          )}

          {players.length > 0 && (
            <Stack gap="xs" className="w-full">
              <Text
                variant={TEXT_VARIANT.MICRO}
                colorTheme={TEXT_THEME.DIMMED}
                className="uppercase tracking-widest pl-1"
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
                    <Row align="center" gap="sm">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm shrink-0">
                        {isRef ? ICONS.REFEREE : ICONS.PLAYER}
                      </div>
                      <Text
                        variant={TEXT_VARIANT.BODY}
                        colorTheme={
                          isRef ? TEXT_THEME.GOLD : TEXT_THEME.DEFAULT
                        }
                        className={isRef ? 'font-bold' : ''}
                      >
                        {player.display_name}
                      </Text>
                    </Row>
                    <div
                      className={cn(
                        'w-5 h-5 rounded border flex items-center justify-center transition-default shrink-0',
                        isRef
                          ? 'bg-gold border-gold text-dark'
                          : 'border-white/20',
                      )}
                    >
                      {isRef && (
                        <span className="text-xs font-black">
                          {ICONS.CHECK}
                        </span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </Stack>
          )}
        </Stack>

        {(hasNoReferee || errors.referees) && (
          <Text
            variant={TEXT_VARIANT.CAPTION}
            colorTheme={TEXT_THEME.DANGER}
            className="text-center block mt-2 animate-fade-in font-bold"
          >
            {errors?.referees?.message || FORM.COMPETITION.HINTS.REFEREE}
          </Text>
        )}
      </Stack>

      <Row gap="sm" className="w-full pt-2">
        <Button
          type="button"
          variant={BUTTON_VARIANT.GHOST}
          onClick={onBack}
          disabled={loading}
          size={BUTTON_SIZE.MEDIUM}
        >
          {BUTTONS.PREVIOUS}
        </Button>
        <Button
          type="submit"
          isLoading={loading}
          disabled={loading || hasNoReferee}
          size={BUTTON_SIZE.MEDIUM}
          fullWidth
          className="flex-1"
        >
          {FORM.COMPETITION.BUTTONS.CREATE}
        </Button>
      </Row>
    </Stack>
  );
};
