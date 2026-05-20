import {
  Input,
  Button,
  Text,
  Card,
  Badge,
  Switch,
  BADGE_VARIANT,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  TEXT_VARIANT,
  CARD_VARIANT,
  Label,
  FORM,
  AVAILABILITY,
  ICONS,
  cn,
  BUTTONS,
} from '@/shared';
import { useEditCompetition, useJoinCodeCheck } from '@/hooks';
import { COMPETITION_UI } from '@/constants';
import { useCompetitionContext } from '@/context';

export const CompetitionGeneralSettings = () => {
  const { competition, refresh } = useCompetitionContext();
  const {
    isEditing,
    setIsEditing,
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    isValid,
    isDirty,
    loading,
  } = useEditCompetition(competition, refresh);

  const startFullDay = watch('startFullDay');
  const endFullDay = watch('endFullDay');
  const watchStartDate = watch('startDate');
  const currentJoinCode = watch('joinCode');

  const { status: codeStatus, isLoading: isCodeChecking } = useJoinCodeCheck(
    currentJoinCode,
    competition.join_code,
  );

  if (!isEditing) {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-gold/20 transition-all">
        <div className="text-center sm:text-left">
          <Text variant={TEXT_VARIANT.BODY} className="font-bold text-gold">
            {competition.name}
          </Text>
          <Text
            variant={TEXT_VARIANT.MICRO}
            className="opacity-40 uppercase tracking-widest"
          >
            <span className="text-gold">{competition.join_code}</span> •{' '}
            {COMPETITION_UI.ADMIN.GENERAL.SETTINGS_LABEL}
          </Text>
        </div>
        <Button
          variant={BUTTON_VARIANT.GHOST}
          size={BUTTON_SIZE.SMALL}
          onClick={() => setIsEditing(true)}
          className="mt-3 sm:mt-0"
        >
          {COMPETITION_UI.ADMIN.GENERAL.BUTTON_EDIT}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-4 sm:p-6 bg-black/20 rounded-3xl border border-gold/20 animate-slide-up"
      noValidate
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={FORM.COMPETITION.LABELS.NAME}
          required
          error={errors?.name?.message}
          {...register('name')}
        />
        <Input
          label={FORM.COMPETITION.LABELS.JOIN_CODE}
          required
          error={errors?.joinCode?.message}
          {...register('joinCode', {
            onChange: (e) => {
              e.target.value = e.target.value.toUpperCase();
            },
          })}
        />
        <div className="h-4 flex justify-center" aria-live="polite">
          {isCodeChecking ? (
            <Text
              variant={TEXT_VARIANT.MICRO}
              className="text-gold animate-pulse text-center"
            >
              {FORM.COMPETITION.HINTS.JOIN_CODE_CHECK}
            </Text>
          ) : codeStatus === AVAILABILITY.AVAILABLE ? (
            <Text
              variant={TEXT_VARIANT.MICRO}
              className="text-success-bright text-center"
            >
              <span className="mr-1" aria-hidden="true">
                {ICONS.SUCCESS}
              </span>
              {FORM.COMPETITION.HINTS.JOIN_CODE_AVAILABLE}
            </Text>
          ) : codeStatus === AVAILABILITY.TAKEN ? (
            <Text
              variant={TEXT_VARIANT.MICRO}
              className="text-danger-bright text-center"
            >
              <span className="mr-1" aria-hidden="true">
                {ICONS.FAILURE}
              </span>
              {FORM.COMPETITION.HINTS.JOIN_CODE_TAKEN}
            </Text>
          ) : null}
        </div>

        <div
          className={cn(
            'space-y-3 p-4 border rounded-2xl transition-all',
            competition.has_started
              ? 'bg-white/2 border-white/5 opacity-60'
              : 'bg-white/5 border-white/10',
          )}
        >
          <Label>
            {FORM.COMPETITION.LABELS.START}
            {competition.has_started && (
              <Badge variant={BADGE_VARIANT.GHOST} className="text-[8px] ml-2">
                {FORM.COMPETITION.HINTS.ALREADY_STARTED}
              </Badge>
            )}
          </Label>
          <Input
            type="date"
            disabled={competition.has_started}
            required
            error={errors?.startDate?.message}
            {...register('startDate')}
          />
          <Card
            variant={CARD_VARIANT.DARK}
            onClick={() =>
              !competition.has_started &&
              setValue('startFullDay', !startFullDay, { shouldDirty: true })
            }
            className={cn(
              'flex items-center justify-between py-2 px-3 cursor-pointer bg-transparent border-transparent shadow-none',
              !competition.has_started
                ? 'cursor-pointer'
                : 'cursor-not-allowed',
            )}
          >
            <Text
              variant={TEXT_VARIANT.MICRO}
              className={startFullDay ? 'text-white' : 'text-white/50'}
            >
              {FORM.COMPETITION.LABELS.FULL_DAY}
            </Text>
            <Switch checked={startFullDay} onChange={() => {}} />
          </Card>
          {!startFullDay && (
            <Input
              type="time"
              disabled={competition.has_started}
              error={errors?.startTime?.message}
              {...register('startTime')}
            />
          )}
        </div>

        {/* BLOC FIN */}
        <div className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <Label>{FORM.COMPETITION.LABELS.END}</Label>
          <Input
            type="date"
            min={watchStartDate}
            error={errors?.endDate?.message}
            {...register('endDate')}
          />
          <Card
            variant={CARD_VARIANT.DARK}
            onClick={() =>
              setValue('endFullDay', !endFullDay, { shouldDirty: true })
            }
            className="flex items-center justify-between py-2 px-3 cursor-pointer bg-transparent border-transparent shadow-none"
          >
            <Text
              variant={TEXT_VARIANT.MICRO}
              className={endFullDay ? 'text-white' : 'text-white/50'}
            >
              {FORM.COMPETITION.LABELS.FULL_DAY}
            </Text>
            <Switch checked={endFullDay} onChange={() => {}} />
          </Card>
          {!endFullDay && (
            <Input
              type="time"
              error={errors?.endTime?.message}
              {...register('endTime')}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-white/5">
        <Button
          type="button"
          variant={BUTTON_VARIANT.GHOST}
          onClick={() => setIsEditing(false)}
          fullWidth
        >
          {BUTTONS.CANCEL}
        </Button>
        <Button
          type="submit"
          fullWidth
          isLoading={loading}
          disabled={
            !isValid ||
            loading ||
            !isDirty ||
            codeStatus === AVAILABILITY.TAKEN ||
            isCodeChecking
          }
        >
          {BUTTONS.SAVE}
        </Button>
      </div>
    </form>
  );
};
