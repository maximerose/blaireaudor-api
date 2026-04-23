import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { useReportAction } from '../../hooks/useReportAction';
import { Card } from '../UI/Card';
import { Text } from '../UI/Typography';
import { preventDefault } from '../../utils/form';
import { cn } from '../../utils/cn';

interface ReportActionFormProps {
  competitionId: string;
  players: { id: string; display_name: string }[];
  minDate: string;
  maxDate: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ReportActionForm = ({
  competitionId,
  players,
  minDate,
  maxDate,
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
  } = useReportAction(competitionId, players, onSuccess);

  const highContrastInput =
    'bg-white/[0.08] border-white/20 placeholder:text-white/20 focus:bg-white/[0.12] focus:border-gold';

  return (
    <div
      className={isExiting ? 'animate-shrink-fade-out' : 'animate-slide-up'}
      role="dialog"
      aria-labelledby="report-form-title"
    >
      <Card
        variant="dark"
        className={cn(
          'transition-all duration-700 ease-in-out border-danger-bright/20 shadow-2xl relative overflow-hidden',
          isSuccess
            ? 'bg-success/10 border-success-bright/20 p-8'
            : 'bg-danger-dark/10 p-5 sm:p-8 shadow-danger/5',
        )}
      >
        {isSuccess ? (
          <div className="text-center animate-fade-in py-4" role="status">
            <div className="relative inline-block mb-4" aria-hidden="true">
              <span className="text-5xl block animate-bounce">📩</span>
              <div className="absolute -inset-2 bg-success-bright/20 blur-xl rounded-full animate-pulse" />
            </div>
            <Text
              id="report-success-title"
              variant="h2"
              className="text-success-bright italic text-2xl"
            >
              C'est envoyé !
            </Text>
            <Text variant="micro" className="mt-3 block text-white">
              L'arbitre va trancher... Préparez les mouchoirs.
            </Text>
          </div>
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
                  className={highContrastInput}
                  align="center"
                  icon={showDropdown ? '🔍' : '👤'}
                />

                {showDropdown && (
                  <Card
                    id="report-search-results"
                    role="listbox"
                    variant="dark"
                    className="absolute top-full left-0 right-0 mt-1 z-50 border-gold/30 max-h-48 overflow-y-auto shadow-2xl bg-black/95 backdrop-blur-xl animate-fade-in no-scrollbar"
                  >
                    {filteredPlayers.length > 0 ? (
                      filteredPlayers.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          role="option"
                          className="w-full p-3 text-center hover:bg-gold/10 text-gold border-b border-white/5 transition-all font-bold italic group cursor-pointer focus:bg-gold/10 focus:outline-none"
                          onClick={() => selectPlayer(p.id, p.display_name)}
                        >
                          <Text
                            variant="body"
                            as="span"
                            className="group-hover:text-gold transition-colors font-bold"
                          >
                            {p.display_name}
                          </Text>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center">
                        <Text variant="micro" className="opacity-40 italic">
                          Aucun blaireau trouvé
                        </Text>
                      </div>
                    )}
                  </Card>
                )}
              </div>

              <Input
                label="Le méfait (description)"
                placeholder="Il a encore fait n'importe quoi..."
                value={formData.description}
                className={highContrastInput}
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
                  className={highContrastInput}
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
                  className={cn('scheme-dark', highContrastInput)}
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
