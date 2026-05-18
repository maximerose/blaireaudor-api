import { useDocumentTitle } from '@/hooks';
import type React from 'react';

interface WizardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const WizardLayout = ({ children, title }: WizardLayoutProps) => {
  useDocumentTitle(title);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-dark animate-fade-in">
      {children}
    </main>
  );
};
