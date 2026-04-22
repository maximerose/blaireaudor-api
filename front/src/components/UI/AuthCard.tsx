import React from 'react';
import { Text } from './Typography';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  onSubmit: React.SubmitEventHandler<HTMLFormElement>;
}

export const AuthCard = ({ children, title, onSubmit }: AuthCardProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-dark">
      <div className="w-full max-w-md animate-slide-up">
        <form
          onSubmit={onSubmit}
          className="bg-white/5 backdrop-blur-xl p-4 rounded-4xl border border-gold/20 shadow-2xl w-full relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <Text variant="h1" as="h1" className="mb-8 text-center">
            {title}
          </Text>

          <div className="space-y-5 relative z-10">{children}</div>
        </form>
      </div>
    </div>
  );
};
