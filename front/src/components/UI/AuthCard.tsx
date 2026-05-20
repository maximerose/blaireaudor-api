import React from 'react';
import { SECTION_HEADER_VARIANT, SectionHeader } from '@/shared';

const AUTH_FORM_CARD =
  'bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-[2.5rem] border border-gold/20 shadow-2xl w-full relative overflow-hidden';
const BACKGROUND_GLOW =
  'absolute -top-24 -right-24 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string | React.ReactNode;
  onSubmit: React.SubmitEventHandler<HTMLFormElement>;
}

export const AuthCard = ({
  children,
  title,
  subtitle,
  onSubmit,
}: AuthCardProps) => {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-dark">
      <div className="w-full max-w-md animate-slide-up">
        <form
          onSubmit={onSubmit}
          aria-labelledby="auth-title"
          className={AUTH_FORM_CARD}
          noValidate
        >
          <div className={BACKGROUND_GLOW} aria-hidden="true" />

          <SectionHeader
            id="auth-title"
            variant={SECTION_HEADER_VARIANT.TITLE}
            centered
            title={title}
            subtitle={subtitle}
          />

          <div className="space-y-5 relative z-10">{children}</div>
        </form>
      </div>
    </main>
  );
};
