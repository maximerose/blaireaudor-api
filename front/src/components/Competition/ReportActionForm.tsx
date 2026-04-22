import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { useReportAction } from '../../hooks/useReportAction';
import { Card } from '../UI/Card';
import { Text } from '../UI/Typography';
import { preventDefault } from '../../utils/form';

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

  return (
    <div className={isExiting ? 'animate-shrink-fade-out' : 'animate-slide-up'}>
      <Card
        variant="dark"
        className={`transition-all duration-700 ease-in-out border-danger-bright/20 ${
          isSuccess
            ? 'bg-success/10 border-success-bright/20 p-8'
            : 'bg-danger-dark/10 p-5 sm:p-8 shadow-danger/5'
        } shadow-2xl relative overflow-hidden`}
      >
        {isSuccess ? (
          <div className="text-center animate-fade-in py-4">
            <div className="relative inline-block mb-4">
              <span className="text-5xl block animate-bounce">📩</span>
              <div className="absolute -inset-2 bg-success-bright/20 blur-xl rounded-full animate-pulse" />
            </div>
            <Text
              variant="h2"
              className="text-success-bright italic lowercase text-2xl"
            >
              C'est envoyé !
            </Text>
            <Text
              variant="caption"
              className="opacity-40 mt-3 block tracking-widest uppercase text-[9px]"
            >
              L'arbitre va trancher... Préparez les mouchoirs.
            </Text>
          </div>
        ) : (
          <form onSubmit={preventDefault(submitReport)} className="space-y-6">
            <header className="text-center space-y-1">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl animate-pulse">🚨</span>
                <Text
                  variant="h2"
                  className="text-danger-bright italic lowercase"
                >
                  Balance ton blaireau
                </Text>
                <span
                  className="text-2xl opacity-0 shrink-0 pointer-events-none select-none"
                  aria-hidden="true"
                >
                  🚨
                </span>
              </div>
              <Text
                variant="caption"
                className="text-white/20 tracking-[0.2em] uppercase"
              >
                Signalement de méfait
              </Text>
            </header>

            <div className="space-y-4">
              <div className="relative space-y-1" ref={searchContainerRef}>
                <Input
                  label="Le coupable"
                  placeholder="Chercher un blaireau..."
                  value={search}
                  autoComplete="off"
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e: any) => {
                    setSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  align="center"
                  icon={showDropdown ? '🔍' : '👤'}
                />

                {showDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-dark border border-gold/30 rounded-xl max-h-48 overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.8)] no-scrollbar backdrop-blur-xl animate-fade-in">
                    {filteredPlayers.length > 0 ? (
                      filteredPlayers.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className="w-full p-3 text-xs text-center hover:bg-gold/10 text-gold border-b border-white/5 transition-all font-bold italic group"
                          onClick={() => {
                            selectPlayer(p.id, p.display_name);
                          }}
                        >
                          <span className="group-hover:text-gold transition-colors">
                            {p.display_name}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-[10px] text-white/20 italic text-center uppercase tracking-widest">
                        Aucun blaireau trouvé
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Input
                label="Le méfait (description)"
                placeholder="Il a encore fait n'importe quoi..."
                value={formData.description}
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
                  className="scheme-dark"
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
                Lancer l'alerte
              </Button>
              <Button
                variant="ghost"
                fullWidth
                type="button"
                onClick={onCancel}
                size="sm"
                className="opacity-40 hover:opacity-100"
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
