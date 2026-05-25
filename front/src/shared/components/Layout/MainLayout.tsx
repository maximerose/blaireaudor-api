import React from 'react';
import { useDocumentTitle } from '@/shared/hooks';
import { Navbar } from '@/shared/components/UI';
import { Stack } from './Stack';
import { cn } from '@/shared/utils';
import { usePushSubscription } from '@/features/notification';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  isFluid?: boolean;
}

export const MainLayout = ({
  children,
  title,
  subtitle,
  isFluid = false,
}: MainLayoutProps) => {
  useDocumentTitle(title);
  usePushSubscription();

  return (
    <Stack gap="none" className="min-h-screen">
      <Navbar subtitle={subtitle} />
      <Stack
        as="main"
        gap="md"
        px="lg"
        mt="md"
        className={cn(
          'flex-1 w-full pb-10 animate-fade-in mx-auto',
          isFluid ? 'max-w-full' : 'max-w-6xl',
        )}
      >
        {children}
      </Stack>
    </Stack>
  );
};
