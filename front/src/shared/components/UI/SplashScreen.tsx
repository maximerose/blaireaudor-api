import { BadgerLogo } from '@/shared/logo';
import { cn } from '@/shared/utils';
import { Text, TEXT_THEME, TEXT_VARIANT } from './Text';
import { UI } from '@/shared/constants';
import { Stack } from '../Layout';
import { useSplashScreen } from '@/shared/hooks/useSplashScreen';

export const SplashScreen = () => {
  const { isMounted, isFading } = useSplashScreen();

  if (!isMounted) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-dark backdrop-blur-sm',
        'transition-opacity duration-500 ease-in-out',
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100',
      )}
    >
      <Stack gap="xl" align="center" className="animate-pulse">
        <BadgerLogo className="w-80 h-80 drop-shadow-[0_0_30px_rgba(255,184,0,0.5)]" />
        <Text as="h1" variant={TEXT_VARIANT.H1} colorTheme={TEXT_THEME.GOLD}>
          {UI.APP_NAME}
        </Text>
      </Stack>
    </div>
  );
};
