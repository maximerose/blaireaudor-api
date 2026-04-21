// front/src/components/Competition/ReportActionForm.tsx
import React from 'react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { useReportAction } from '../../hooks/useReportAction';

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
  const { formData, loading, handleChange, submitReport, isSuccess } =
    useReportAction(competitionId, onSuccess);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    submitReport();
  };

  if (isSuccess) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center animate-in zoom-in duration-300">
        <span className="text-3xl block mb-2">📩</span>
        <h3 className="text-green-500 font-black uppercase text-sm tracking-widest">
          C'est envoyé !
        </h3>
        <p className="text-white/40 text-[10px] mt-1 uppercase">
          L'arbitre va trancher...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">🚨</span>
        <h3 className="text-red-500 font-black uppercase tracking-tighter italic text-lg">
          Balance ton blaireau
        </h3>
      </div>

      <div className="w-full">
        <label className="block text-gold/80 text-sm mb-1 ml-1">
          Le coupable
        </label>
        <select
          required
          value={formData.targetPlayerId}
          onChange={(e) => handleChange('targetPlayerId', e.target.value)}
          className="w-full bg-dark border text-gold border-gold/30 rounded-lg px-4 py-2 focus:outline-none focus:border-gold transition-colors text-sm cursor-pointer appearance-none"
        >
          <option value="">-- Sélectionner l'adversaire --</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.display_name}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Description du crime"
        placeholder="Il a encore fait n'importe quoi..."
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Points (malus)"
          type="number"
          icon="⚡"
          value={formData.points}
          onChange={(e) => handleChange('points', e.target.value)}
          required
        />
        <Input
          label="Date du méfait"
          type="date"
          min={minDate}
          max={maxDate}
          value={formData.dateAction}
          onChange={(e) => handleChange('dateAction', e.target.value)}
          required
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
        >
          Annuler
        </button>
        <Button
          type="submit"
          isLoading={loading}
          className="flex-2 bg-red-600 hover:bg-red-500 shadow-red-900/20 text-white text-[10px] uppercase tracking-widest"
        >
          Dénoncer maintenant
        </Button>
      </div>
    </form>
  );
};
