import { useDocumentTitle } from '@/hooks';
import type React from 'react';

interface WizardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const WizardLayout = ({ children, title }: WizardLayoutProps) => {
  useDocumentTitle(title);

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-dark animate-fade-in">
      <div className="w-full max-w-md sm:max-w-lg">{children}</div>
    </main>
  );
};
