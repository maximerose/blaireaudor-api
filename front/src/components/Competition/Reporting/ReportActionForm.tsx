import { Input, Button, Card, Text } from '@/components/UI';
import { useReportAction } from '@/hooks';
import { preventDefault, cn } from '@/utils';
import { PlayerDropdownList } from '@/components/Competition';
import type { Competition } from '@/types';
import { FORM, ICONS } from '@/constants';

const INPUT_STYLE =
  'bg-white/[0.08] border-white/20 focus:border-gold transition-colors';

interface Props {
  competition: Competition;
  players: { id: string; display_name: string }[];
  isAdmin: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ReportActionForm = ({
  competition,
  players,
  isAdmin,
  onSuccess,
  onCancel,
}: Props) => {
  const {
    formData,
    loading,
    dateLimits,
    setFormData,
    submitReport,
    search,
    setSearch,
    showDropdown,
    setShowDropdown,
    searchContainerRef,
    filteredPlayers,
    selectPlayer,
  } = useReportAction(competition, players, onSuccess, isAdmin);

  return (
    <div className="animate-slide-up" role="dialog">
      <Card
        variant="dark"
        className="border-danger-bright/20 shadow-2xl p-5 sm:p-8 bg-danger-dark/10"
      >
        <form onSubmit={preventDefault(submitReport)} className="space-y-6">
          <header className="text-center">
            <Text
              variant="h2"
              className="text-danger-bright italic flex items-center justify-center gap-2"
            >
              <span className="animate-pulse">{ICONS.ALARM}</span>{' '}
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
                className={INPUT_STYLE}
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
              className={INPUT_STYLE}
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
                className={INPUT_STYLE}
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
                className={cn('scheme-dark', INPUT_STYLE)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="danger"
              fullWidth
              type="submit"
              isLoading={loading}
            >
              {FORM.REPORT_ACTION.BUTTONS.SUBMIT}
            </Button>
            <Button variant="ghost" fullWidth onClick={onCancel} size="sm">
              {FORM.REPORT_ACTION.BUTTONS.CANCEL}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
