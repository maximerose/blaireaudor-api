import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  onSubmit: React.SubmitEventHandler<HTMLFormElement>;
}

export const AuthCard = ({ children, title, onSubmit }: AuthCardProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-gold/20 shadow-2xl w-full"
    >
      <h2 className="text-3xl font-bold text-gold mb-6 text-center">{title}</h2>
      <div className="space-y-4">{children}</div>
    </form>
  );
};
