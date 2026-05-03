import { Input, Button, Card, Text } from '@/components/UI';
import { useReportAction } from '@/hooks';
import { preventDefault, cn } from '@/utils';
import { PlayerDropdownList } from '@/components/Competition';
import type { Competition } from '@/types';

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
              <span className="animate-pulse">🚨</span> Balance ton blaireau
            </Text>
            <Text variant="caption" className="text-white/60">
              Signalement de méfait
            </Text>
          </header>

          <div className="space-y-4">
            <div className="relative" ref={searchContainerRef}>
              <Input
                label="Le coupable"
                placeholder="Chercher un blaireau..."
                value={search}
                required
                onFocus={() => setShowDropdown(true)}
                onChange={(e: any) => setSearch(e.target.value)}
                className={INPUT_STYLE}
                icon={showDropdown ? '🔍' : '👤'}
              />
              {showDropdown && (
                <PlayerDropdownList
                  filteredPlayers={filteredPlayers}
                  selectPlayer={selectPlayer}
                />
              )}
            </div>

            <Input
              label="Le méfait"
              placeholder="Description du crime..."
              value={formData.description}
              onChange={(e: any) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              required
              className={INPUT_STYLE}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Points"
                type="number"
                icon="⚡"
                value={formData.points}
                onChange={(e: any) =>
                  setFormData((p) => ({ ...p, points: e.target.value }))
                }
                required
                className={INPUT_STYLE}
              />
              <Input
                label="Date"
                type="date"
                min={dateLimits.minDate}
                max={dateLimits.maxDate}
                value={formData.dateAction}
                onChange={(e: any) =>
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
              Dénoncer l'action
            </Button>
            <Button variant="ghost" fullWidth onClick={onCancel} size="sm">
              Finalement, je pardonne
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
