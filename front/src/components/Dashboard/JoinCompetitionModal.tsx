import React, { useState } from 'react';
import { useJoinByCode } from '../../hooks/useJoinByCode';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';

interface Props {
  onClose: () => void;
  onJoined: (code: string) => void;
}

export const JoinCompetitionModal = ({ onClose, onJoined }: Props) => {
  const [code, setCode] = useState('');
  const { joinByCode, loading, error } = useJoinByCode(onJoined);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    joinByCode(code.trim().toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-dark border border-gold/20 w-full max-w-sm rounded-3xl p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
        <header className="text-center">
          <span className="text-3xl block mb-2">🔑</span>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
            Rejoindre une arène
          </h2>
          <p className="text-gold/40 text-[10px] uppercase tracking-widest mt-1">
            Saisis le code d'accès
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              placeholder="EX: BLAIR-XYZ"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-center font-black tracking-[0.2em] text-xl uppercase"
              autoFocus
              required
            />
            {error && (
              <p className="text-red-500 text-[10px] font-bold uppercase text-center animate-pulse">
                ⚠️ {error}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-[10px] font-black uppercase text-white/30 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <Button type="submit" isLoading={loading} className="flex-2 py-4">
              Entrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
