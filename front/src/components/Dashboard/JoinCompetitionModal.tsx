import React, { useState } from 'react';
import { useJoinByCode } from '../../hooks/useJoinByCode';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Card } from '../UI/Card';
import { Text } from '../UI/Typography';
import { formatJoinCode } from '../../utils/stringUtils';

interface Props {
  onClose: () => void;
  onJoined: (code: string) => void;
}

export const JoinCompetitionModal = ({ onClose, onJoined }: Props) => {
  const [code, setCode] = useState('');
  const { joinByCode, loading, error } = useJoinByCode(onJoined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    joinByCode(code.trim());
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatJoinCode(e.target.value);
    setCode(formatted);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <Card
        variant="default"
        className="w-full max-w-sm p-8 bg-[#161616] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.1)] border-gold/20 rounded-[2.5rem] space-y-8 animate-slide-up"
      >
        <header className="text-center space-y-2">
          <div
            className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
            aria-hidden="true"
          >
            <span className="text-xl">🔑</span>
          </div>
          <Text id="modal-title" variant="h2" className="italic">
            Rejoindre l'arène
          </Text>
          <Text variant="caption">Saisis le code de l'arène</Text>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <Input
              label="Code de l'arène"
              placeholder="BLAIR-2026"
              value={code}
              onChange={handleCodeChange}
              className="text-center font-mono font-black tracking-[0.2em] text-xl uppercase"
              autoFocus
              required
              align="center"
              aria-invalid={!!error}
              aria-describedby={error ? 'join-error' : undefined}
            />

            {error && (
              <Text
                id="join-error"
                role="alert"
                variant="micro"
                className="text-danger-bright text-center animate-pulse"
              >
                ⚠️ {error}
              </Text>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button type="submit" isLoading={loading} fullWidth size="lg">
              Entrer dans l'arène
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/20 hover:text-white/50"
              aria-label="Fermer la modale"
            >
              Fermer
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
