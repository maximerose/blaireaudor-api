import {
  Button,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  FORM,
  BUTTONS,
  Stack,
  Row,
  Grid,
} from '@/shared';
import { COMPETITION_UI } from '@/features/competition/constants';
import { useCompetitionContext } from '@/features/competition/context';
import { useEditCompetition } from '@/features/competition/admin/hooks';
import {
  CompetitionDateTimeField,
  CompetitionJoinCodeField,
  CompetitionNameField,
} from '@/features/competition/fields';

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

  const watchStartDate = watch('startDate');

  if (!isEditing) {
    return (
      <Row
        justify="between"
        align="center"
        className="flex-col sm:flex-row p-4 bg-surface-base rounded-2xl border border-border-subtle group hover:border-gold/20 transition-all w-full gap-4"
      >
        <Stack gap="none" className="text-center sm:text-left">
          <Text variant={TEXT_VARIANT.BODY} className="font-bold text-gold">
            {competition.name}
          </Text>
          <Text
            variant={TEXT_VARIANT.MICRO}
            colorTheme={TEXT_THEME.DIMMED}
            className="uppercase tracking-widest"
          >
            <span className="text-gold">{competition.join_code}</span> •{' '}
            {COMPETITION_UI.ADMIN.GENERAL.SETTINGS_LABEL}
          </Text>
        </Stack>
        <Button
          variant={BUTTON_VARIANT.GHOST}
          size={BUTTON_SIZE.SMALL}
          onClick={() => setIsEditing(true)}
          className="w-full sm:w-auto cursor-pointer"
        >
          {COMPETITION_UI.ADMIN.GENERAL.BUTTON_EDIT}
        </Button>
      </Row>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <Stack
        gap="lg"
        className="p-4 sm:p-6 bg-black/20 rounded-3xl border border-gold/20 animate-slide-up w-full"
      >
        <Grid cols={1} md={2} gap="lg" className="w-full">
          <CompetitionNameField register={register} errors={errors} />

          <CompetitionJoinCodeField
            register={register}
            watch={watch}
            errors={errors}
            setValue={setValue}
            initialJoinCode={competition.join_code}
          />

          <CompetitionDateTimeField
            label={FORM.COMPETITION.LABELS.START}
            badgeHint={
              competition.has_started
                ? FORM.COMPETITION.HINTS.ALREADY_STARTED
                : undefined
            }
            dateName="startDate"
            timeName="startTime"
            fullDayName="startFullDay"
            disabled={competition.has_started}
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />

          <CompetitionDateTimeField
            label={FORM.COMPETITION.LABELS.END}
            dateName="endDate"
            timeName="endTime"
            fullDayName="endFullDay"
            minDate={watchStartDate}
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />
        </Grid>

        <Row
          justify="end"
          gap="sm"
          className="flex-col-reverse sm:flex-row pt-4 border-t border-border-subtle w-full"
        >
          <Button
            type="button"
            variant={BUTTON_VARIANT.GHOST}
            onClick={() => setIsEditing(false)}
            className="w-full sm:w-auto cursor-pointer"
          >
            {BUTTONS.CANCEL}
          </Button>
          <Button
            type="submit"
            isLoading={loading}
            disabled={!isValid || loading || !isDirty}
            className="w-full sm:w-auto cursor-pointer"
          >
            {BUTTONS.SAVE}
          </Button>
        </Row>
      </Stack>
    </form>
  );
};
