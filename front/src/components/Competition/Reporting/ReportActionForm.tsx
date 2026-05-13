import {
  Input,
  Button,
  Card,
  Text,
  BUTTON_VARIANT,
  BUTTON_SIZE,
} from '@/components/UI';
import { useCompetition, useReportAction } from '@/hooks';
import { preventDefault } from '@/utils';
import { PlayerDropdownList } from '@/components/Competition';
import { FORM, ICONS } from '@/constants';
import { useReportingContext } from '@/context/ReportingContext';

export const ReportActionForm = () => {
  const { refresh } = useCompetition();
  const { potentialTargets, toggleReporting } = useReportingContext();

  const {
    formData,
    loading,
    setFormData,
    submitReport,
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
      <Card variant="glass" className="shadow-2xl p-5 sm:p-8">
        <form onSubmit={preventDefault(submitReport)} className="space-y-6">
          <header className="text-center">
            <div className="animate-bounce-subtle mb-3">
              <span className="text-3xl">{ICONS.BADGER}</span>
            </div>
            <Text
              variant="h2"
              className="text-gold italic flex items-center justify-center gap-2"
            >
              {FORM.REPORT_ACTION.TITLE}
            </Text>
            <Text variant="caption" className="text-white/60">
              {FORM.REPORT_ACTION.SUBTITLE}
            </Text>
          </header>

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
              value={formData.description}
              autoComplete="off"
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label={FORM.REPORT_ACTION.LABELS.POINTS}
                type="number"
                icon={ICONS.POINTS}
                value={formData.points}
                step="10"
                onChange={(e) =>
                  setFormData((p) => ({ ...p, points: Number(e.target.value) }))
                }
                required
              />
              <Input
                label={FORM.SHARED.LABELS.DATE}
                type="date"
                min={dateLimits.minDate}
                max={dateLimits.maxDate}
                value={formData.dateAction}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, dateAction: e.target.value }))
                }
                required
                className="scheme-dark"
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
