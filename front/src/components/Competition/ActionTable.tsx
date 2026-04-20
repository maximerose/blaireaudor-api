import React from 'react';
import { useActionTable } from '../../hooks/useActionTable';
import { DateNavigation } from './DateNavigation';

export const ActionTable = ({ actions }: { actions: any[] }) => {
  const {
    sortedActions,
    sortField,
    sortOrder,
    handleSort,
    selectedDate,
    setSelectedDate,
    availableDates,
  } = useActionTable(actions);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1 text-gold">{sortOrder === 'asc' ? '↑' : '↓'}</span>
    );
  };

  return (
    <div className="space-y-4">
      <DateNavigation
        dates={availableDates}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
      />
      <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/20 shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gold/10 text-[10px] font-black uppercase text-gold/60 tracking-widest border-b border-gold/10">
              <th
                className="p-4 cursor-pointer hover:text-gold transition-colors"
                onClick={() => handleSort('date_action')}
              >
                Date <SortIcon field="date_action" />
              </th>
              <th
                className="p-4 cursor-pointer hover:text-gold transition-colors"
                onClick={() => handleSort('player')}
              >
                Joueur <SortIcon field="player" />
              </th>
              <th className="p-4">Action</th>
              <th
                className="p-4 text-right cursor-pointer hover:text-gold transition-colors"
                onClick={() => handleSort('points')}
              >
                Points <SortIcon field="points" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedActions.map((action) => (
              <tr
                key={action.id}
                className="hover:bg-white/5 transition-colors group"
              >
                <td className="p-4 text-[11px] font-mono text-white/40">
                  {new Date(action.date_action).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </td>
                <td className="p-4 text-sm font-bold text-white tracking-tight">
                  {action.player?.display_name || 'Anonyme'}
                </td>
                <td
                  className="p-4 text-xs text-white/60 italic max-w-xs truncate"
                  title={action.description}
                >
                  "{action.description}"
                </td>
                <td className="p-4 text-right">
                  <span className="text-red-500 font-black text-sm">
                    +{action.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedActions.length === 0 && (
          <div className="p-10 text-center text-white/20 text-xs italic">
            Aucune action trouvée.
          </div>
        )}
      </div>
    </div>
  );
};
