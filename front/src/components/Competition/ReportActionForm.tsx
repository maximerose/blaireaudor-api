// front/src/components/Competition/ReportActionForm.tsx
import React from 'react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { useReportAction } from '../../hooks/useReportAction';
import { Card } from '../UI/Card';

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
      <Card variant="glass" className="p-8 text-center border-green-500/20">
        <span className="text-3xl block mb-2">📩</span>
        <h3 className="text-green-500 font-black uppercase text-sm tracking-widest">
          C'est envoyé !
        </h3>
        <p className="text-white/40 text-[10px] mt-1 uppercase">
          L'arbitre va trancher...
        </p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-red-500/5 border-red-500/20 p-6 space-y-5">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl animate-pulse">🚨</span>
          <h3 className="text-red-500 font-black uppercase tracking-tighter italic text-xl">
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
          label="Description de l'action"
          placeholder="Il a encore fait n'importe quoi..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Points"
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
          <Button variant="ghost" fullWidth type="button" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant="danger" fullWidth type="submit" isLoading={loading}>
            Dénoncer
          </Button>
        </div>
      </Card>
    </form>
  );
};
