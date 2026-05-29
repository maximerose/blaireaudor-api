import { usePushSubscription } from '@/features/notification';
import { Navbar } from '@/shared/components/UI';
import { useDocumentTitle } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import React from 'react';
import { Stack } from './Stack';

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
        px="md"
        mt="md"
        className={cn(
          'flex-1 w-full pb-20 md:pb-10 animate-fade-in mx-auto',
          isFluid ? 'max-w-full' : 'max-w-6xl',
        )}
      >
        {children}
      </Stack>
    </Stack>
  );
};
