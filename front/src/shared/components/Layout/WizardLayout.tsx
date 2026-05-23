import React from 'react';
import { useDocumentTitle } from '@/shared/hooks';
import { Stack } from './Stack';

interface WizardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const WizardLayout = ({ children, title }: WizardLayoutProps) => {
  useDocumentTitle(title);

  return (
    <Stack
      as="main"
      align="center"
      justify="center"
      p="md"
      className="w-full min-h-screen bg-dark animate-fade-in"
    >
      <div className="w-full max-w-md sm:max-w-lg">{children}</div>
    </Stack>
  );
};
