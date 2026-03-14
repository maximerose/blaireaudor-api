import React, { useState } from 'react';
import { useCreateCompetition } from '../../hooks/useCreateCompetition';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';

interface Props {
  onSuccess: { (_competition: any): void };
}

export const CreateCompetitionView = ({ onSuccess }: Props) => {
  const { create, loading } = useCreateCompetition();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    joinCode: '',
    participate: true,
    fogOfWar: true,
  });

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const result = await create(formData);
    if (result) {
      onSuccess(result);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            Étape 1 : <span className="text-gold">La compétition</span>
          </h2>
          <p className="text-gold/40 text-[10px] uppercase tracking-widest font-bold">
            Configuration de base
          </p>
        </div>

        <Input
          label="Nom de la compétition"
          placeholder="Ex: Tournoi des Gars Sûrs"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          label="Code d'accès personnalisé (Optionnel)"
          placeholder="Ex: BLAIREAU2026"
          maxLength={10}
          value={formData.joinCode}
          onChange={(e) =>
            setFormData({ ...formData, joinCode: e.target.value.toUpperCase() })
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Début"
            type="date"
            required
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
          <Input
            label="Fin (Optionnel)"
            type="date"
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
          />
        </div>

        <div
          onClick={() =>
            setFormData({ ...formData, fogOfWar: !formData.fogOfWar })
          }
          className="flex items-center justify-between p-4 bg-dark/50 border border-gold/10 rounded-xl cursor-pointer hover:bg-gold/5 transition-colors"
        >
          <div className="flex flex-col">
            <span className="text-[10px] text-gold uppercase font-black">
              Brouillard de guerre
            </span>
            <span className="text-[9px] text-white/30 italic">
              Scores cachés pendant le tournoi
            </span>
          </div>
          <div
            className={`w-10 h-5 rounded-full relative transition-colors ${formData.fogOfWar ? 'bg-gold' : 'bg-white/10'}`}
          >
            <div
              className={`absolute top-1 w-3 h-3 bg-dark rounded-full transition-all ${formData.fogOfWar ? 'left-6' : 'left-1'}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 ml-1">
          <Input
            type="checkbox"
            id="participate"
            checked={formData.participate}
            onChange={(e) =>
              setFormData({ ...formData, participate: e.target.checked })
            }
            className="w-4 h-4 accent-gold"
          />
          <label
            htmlFor="participate"
            className="text-[10px] text-white/60 uppercase font-bold cursor-pointer"
          >
            M'inscrire automatiquement à cette compétition
          </label>
        </div>

        <Button disabled={loading}>
          {loading ? 'Instanciation...' : 'Valider & Recruter'}
        </Button>
      </form>
    </div>
  );
};
