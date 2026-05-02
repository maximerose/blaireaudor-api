import { Text, Input, Button, Badge } from '@/components/UI';
import { formatShortDate } from '@/utils';
import { useBonusDayForm } from '@/hooks/competition/useBonusDayForm';

export const BonusDayManagement = () => {
  const {
    newDate,
    setNewDate,
    multiplier,
    setMultiplier,
    handleAdd,
    deleteBonus,
    isAdding,
    bonusDays,
    minDate,
    maxDate,
  } = useBonusDayForm();

  return (
    <div className="space-y-6 pt-6 border-t border-white/5">
      <header className="flex flex-col gap-1">
        <Text variant="h3" className="text-gold italic">
          🔥 Multiplicateurs
        </Text>
        <Text variant="micro" className="opacity-30">
          Multipliez les points de la journée.
        </Text>
      </header>

      <div className="flex items-end gap-3 bg-white/2 p-4 rounded-2xl border border-white/5">
        <div className="flex-1">
          <Input
            type="date"
            label="Choisir une date"
            value={newDate}
            min={minDate}
            max={maxDate}
            className="scheme-dark"
            onKeyDown={(e) => e.preventDefault()}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </div>
        <div className="w-24">
          <Input
            type="number"
            label="Coeff."
            min={2}
            value={multiplier}
            onChange={(e: any) => setMultiplier(parseInt(e.target.value))}
          />
        </div>
        <Button onClick={handleAdd} isLoading={isAdding} disabled={!newDate}>
          Ajouter
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {bonusDays.map((bd) => (
          <Badge key={bd.id} variant="gold" className="pl-3 pr-1 py-1 gap-3">
            <span className="font-mono text-[10px]">
              {formatShortDate(bd.date)} —{' '}
              <span className="text-white">x{bd.multiplier}</span>
            </span>
            <button
              type="button"
              onClick={() => deleteBonus(bd.id)}
              className="w-5 h-5 flex items-center justify-center rounded-md bg-danger/20 text-danger-bright hover:bg-danger hover:text-white transition-default"
            >
              ✕
            </button>
          </Badge>
        ))}

        {bonusDays.length === 0 && (
          <Text variant="micro" className="italic opacity-20 py-2">
            Aucun multiplicateur programmé.
          </Text>
        )}
      </div>
    </div>
  );
};
