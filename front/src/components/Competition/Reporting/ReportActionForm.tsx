import {
  Input,
  Button,
  Card,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  CARD_VARIANT,
  SectionHeader,
  SECTION_HEADER_VARIANT,
} from '@/components/UI';
import { useReportAction } from '@/hooks';
import { PlayerDropdownList } from '@/components/Competition';
import { FORM, ICONS } from '@/constants';
import { useCompetitionContext, useReportingContext } from '@/context';

export const ReportActionForm = () => {
  const { refresh } = useCompetitionContext();
  const { potentialTargets, toggleReporting } = useReportingContext();

  const {
    register,
    handleSubmit,
    errors,
    loading,
    search,
    setSearch,
    showDropdown,
    setShowDropdown,
    searchContainerRef,
    filteredPlayers,
    selectPlayer,
    dateLimits,
  } = useReportAction(potentialTargets, () => {
    toggleReporting();
    refresh();
  });

  return (
    <div className="animate-slide-up" role="dialog">
      <Card variant={CARD_VARIANT.GLASS} className="shadow-2xl p-5 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <SectionHeader
            icon={ICONS.BADGER}
            title={FORM.REPORT_ACTION.TITLE}
            subtitle={FORM.REPORT_ACTION.SUBTITLE}
            variant={SECTION_HEADER_VARIANT.BLOCK}
            centered
          />

          <div className="space-y-4">
            <div className="relative" ref={searchContainerRef}>
              <Input
                label={FORM.REPORT_ACTION.LABELS.PLAYER}
                placeholder={FORM.REPORT_ACTION.PLACEHOLDERS.PLAYER}
                value={search}
                required
                autoComplete="off"
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => setSearch(e.target.value)}
                icon={showDropdown ? ICONS.SEARCH : ICONS.PLAYER}
                error={errors?.targetPlayerId?.message}
              />
              {showDropdown && (
                <PlayerDropdownList
                  filteredPlayers={filteredPlayers}
                  selectPlayer={selectPlayer}
                />
              )}
            </div>

            <Input
              label={FORM.REPORT_ACTION.LABELS.DESCRIPTION}
              placeholder={FORM.REPORT_ACTION.PLACEHOLDERS.DESCRIPTION}
              autoComplete="off"
              required
              error={errors?.description?.message}
              {...register('description')}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label={FORM.REPORT_ACTION.LABELS.POINTS}
                type="number"
                icon={ICONS.POINTS}
                step="10"
                required
                error={errors?.points?.message}
                {...register('points', { valueAsNumber: true })}
              />
              <Input
                label={FORM.SHARED.LABELS.DATE}
                type="date"
                min={dateLimits.minDate}
                max={dateLimits.maxDate}
                required
                {...register('dateAction')}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant={BUTTON_VARIANT.PRIMARY}
              fullWidth
              type="submit"
              isLoading={loading}
            >
              {FORM.REPORT_ACTION.BUTTONS.SUBMIT}
            </Button>
            <Button
              variant={BUTTON_VARIANT.GHOST}
              fullWidth
              onClick={toggleReporting}
              size={BUTTON_SIZE.SMALL}
            >
              {FORM.REPORT_ACTION.BUTTONS.CANCEL}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
