import { useDocumentTitle } from '@/hooks';
import type React from 'react';
import { Navbar } from '../UI';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const MainLayout = ({ children, title, subtitle }: MainLayoutProps) => {
  useDocumentTitle(title);

  return (
    <div className="w-full mx-auto min-h-screen flex flex-col">
      <Navbar subtitle={subtitle} />
      <main className="flex-1 w-full max-w-full min-w-0 mx-auto px-4 sm:px-6 pb-10 mt-4 animate-fade-in flex flex-col">
        {children}
      </main>
    </div>
  );
};
