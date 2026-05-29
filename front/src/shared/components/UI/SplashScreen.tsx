import { UI } from '@/shared/constants';
import { useSplashScreen } from '@/shared/hooks/useSplashScreen';
import { BadgerLogo } from '@/shared/logo';
import { cn } from '@/shared/utils';
import { Stack } from '../Layout';
import { Text, TEXT_THEME, TEXT_VARIANT } from './Text';

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
        <BadgerLogo className="w-60 h-60 md:w-80 md:h-80 drop-shadow-[0_0_30px_rgba(255,184,0,0.5)]" />
        <Text as="h1" variant={TEXT_VARIANT.H1} colorTheme={TEXT_THEME.GOLD}>
          {UI.APP_NAME}
        </Text>
      </Stack>
    </div>
  );
};
