import { Input, Button, Card, Text } from '@/components/UI';
import { useReportAction } from '@/hooks';
import { preventDefault, cn } from '@/utils';
import {
  ReportSuccessView,
  PlayerDropdownList,
} from '@/components/Competition';

const HIGH_CONTRAST_INPUT =
  'bg-white/[0.08] border-white/20 placeholder:text-white/20 focus:bg-white/[0.12] focus:border-gold';

interface ReportActionFormProps {
  competitionId: string;
  players: { id: string; display_name: string }[];
  minDate: string;
  maxDate: string;
  isAdmin: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ReportActionForm = ({
  competitionId,
  players,
  minDate,
  maxDate,
  isAdmin,
  onSuccess,
  onCancel,
}: ReportActionFormProps) => {
  const {
    formData,
    loading,
    handleChange,
    submitReport,
    isSuccess,
    isExiting,
    search,
    setSearch,
    showDropdown,
    setShowDropdown,
    searchContainerRef,
    filteredPlayers,
    selectPlayer,
  } = useReportAction(competitionId, players, onSuccess, isAdmin);

  return (
    <div
      className={isExiting ? 'animate-shrink-fade-out' : 'animate-slide-up'}
      role="dialog"
      aria-labelledby="report-form-title"
    >
      <Card
        variant="dark"
        className={cn(
          'transition-superslow border-danger-bright/20 shadow-2xl relative overflow-hidden',
          isSuccess
            ? 'bg-success/10 border-success-bright/20 p-8'
            : 'bg-danger-dark/10 p-5 sm:p-8 shadow-danger/5',
        )}
      >
        {isSuccess ? (
          <ReportSuccessView />
        ) : (
          <form
            onSubmit={preventDefault(submitReport)}
            className="space-y-6"
            aria-label="Signaler un nouveau méfait"
          >
            <header className="text-center space-y-1">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl animate-pulse" aria-hidden="true">
                  🚨
                </span>
                <Text
                  id="report-form-title"
                  variant="h2"
                  className="text-danger-bright italic"
                >
                  Balance ton blaireau
                </Text>
                <span className="text-2xl opacity-0" aria-hidden="true">
                  🚨
                </span>
              </div>
              <Text variant="caption" className="text-white">
                Signalement de méfait
              </Text>
            </header>

            <div className="space-y-4">
              <div className="relative" ref={searchContainerRef}>
                <Input
                  label="Le coupable"
                  placeholder="Chercher un blaireau..."
                  value={search}
                  autoComplete="off"
                  required
                  role="combobox"
                  aria-expanded={showDropdown && filteredPlayers.length > 0}
                  aria-controls="report-search-results"
                  aria-haspopup="listbox"
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e: any) => {
                    setSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  className={HIGH_CONTRAST_INPUT}
                  align="center"
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
                label="Le méfait (description)"
                placeholder="Il a encore fait n'importe quoi..."
                value={formData.description}
                className={HIGH_CONTRAST_INPUT}
                onChange={(e: any) =>
                  handleChange('description', e.target.value)
                }
                required
                align="center"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Points"
                  type="number"
                  icon="⚡"
                  value={formData.points}
                  className={HIGH_CONTRAST_INPUT}
                  onChange={(e: any) => handleChange('points', e.target.value)}
                  required
                  align="center"
                />
                <Input
                  label="Date de l'action"
                  type="date"
                  min={minDate}
                  max={maxDate}
                  value={formData.dateAction}
                  onChange={(e: any) =>
                    handleChange('dateAction', e.target.value)
                  }
                  required
                  align="center"
                  className={cn('scheme-dark', HIGH_CONTRAST_INPUT)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="danger"
                fullWidth
                type="submit"
                isLoading={loading}
                size="md"
              >
                Dénoncer l'action
              </Button>
              <Button
                variant="ghost"
                fullWidth
                type="button"
                onClick={onCancel}
                size="sm"
                aria-label="Annuler et fermer le formulaire"
              >
                Finalement, je pardonne
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
