import {
  Input,
  Button,
  Card,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  CARD_VARIANT,
  SectionHeader,
  SECTION_HEADER_VARIANT,
  FORM,
  Stack,
  Grid,
} from '@/shared';
import {
  useCompetitionContext,
  useReportingContext,
} from '@/features/competition/context';
import { useReportAction } from '@/features/competition/reporting/hooks';
import {
  ActionDescriptionField,
  ActionPlayerField,
  ActionPointsField,
} from '@/features/competition/actions/fields';

export const ReportActionForm = () => {
  const { refresh } = useCompetitionContext();
  const { potentialTargets, toggleReporting } = useReportingContext();

  const {
    register,
    handleSubmit,
    errors,
    loading,
    search,
    showDropdown,
    setShowDropdown,
    searchContainerRef,
    filteredPlayers,
    selectPlayer,
    dateLimits,
    handleSearchChange,
  } = useReportAction(potentialTargets, () => {
    toggleReporting();
    refresh();
  });

  return (
    <div className="animate-slide-up w-full max-w-md mx-auto" role="dialog">
      <Card variant={CARD_VARIANT.GLASS} className="shadow-modal w-full">
        <Card.Body p="xl">
          <form onSubmit={handleSubmit} noValidate className="w-full">
            <Stack gap="lg" className="w-full">
              <SectionHeader
                title={FORM.REPORT_ACTION.TITLE}
                subtitle={FORM.REPORT_ACTION.SUBTITLE}
                variant={SECTION_HEADER_VARIANT.BLOCK}
                centered
              />

              <Stack gap="md" className="w-full">
                <input type="hidden" {...register('targetPlayerId')} />

                <ActionPlayerField
                  search={search}
                  showDropdown={showDropdown}
                  setShowDropdown={setShowDropdown}
                  searchContainerRef={searchContainerRef}
                  filteredPlayers={filteredPlayers}
                  selectPlayer={selectPlayer}
                  handleSearchChange={handleSearchChange}
                  disabled={loading}
                  error={errors?.targetPlayerId?.message}
                />

                <ActionDescriptionField
                  disabled={loading}
                  error={errors?.description?.message}
                  {...register('description')}
                />

                <Grid cols={2} gap="md" className="w-full">
                  <ActionPointsField
                    disabled={loading}
                    error={errors?.points?.message}
                    {...register('points', { valueAsNumber: true })}
                  />

                  <Input
                    label={FORM.SHARED.LABELS.DATE}
                    type="date"
                    min={dateLimits.minDate}
                    max={dateLimits.maxDate}
                    error={errors?.dateAction?.message}
                    required
                    disabled={loading}
                    {...register('dateAction')}
                  />
                </Grid>
              </Stack>

              <Stack gap="sm" className="w-full pt-2">
                <Button
                  variant={BUTTON_VARIANT.PRIMARY}
                  fullWidth
                  type="submit"
                  isLoading={loading}
                >
                  {FORM.REPORT_ACTION.BUTTONS.SUBMIT}
                </Button>
                <Button
                  variant={BUTTON_VARIANT.GHOST_NEUTRAL}
                  fullWidth
                  onClick={toggleReporting}
                  size={BUTTON_SIZE.SMALL}
                  disabled={loading}
                >
                  {FORM.REPORT_ACTION.BUTTONS.CANCEL}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};
