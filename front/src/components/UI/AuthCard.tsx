import React from 'react';
import { Text, TEXT_VARIANT } from '@/components/UI';

const AUTH_FORM_CARD =
  'bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-[2.5rem] border border-gold/20 shadow-2xl w-full relative overflow-hidden';
const BACKGROUND_GLOW =
  'absolute -top-24 -right-24 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  onSubmit: React.SubmitEventHandler<HTMLFormElement>;
}

export const AuthCard = ({ children, title, onSubmit }: AuthCardProps) => {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-dark">
      <div className="w-full max-w-md animate-slide-up">
        <form
          onSubmit={onSubmit}
          aria-labelledby="auth-title"
          className={AUTH_FORM_CARD}
        >
          <div className={BACKGROUND_GLOW} aria-hidden="true" />

          <header className="mb-8 relative z-10">
            <Text
              variant={TEXT_VARIANT.H1}
              as="h1"
              id="auth-title"
              className="text-center italic"
            >
              {title}
            </Text>
          </header>

          <div className="space-y-5 relative z-10">{children}</div>
        </form>
      </div>
    </main>
  );
};
