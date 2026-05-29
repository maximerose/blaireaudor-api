import { useEffect, useState } from 'react';
import { UI } from '../constants';

export const useSplashScreen = (
  unmountDelay = UI.TIMINGS.SPLASH_DURATION,
  fadeDelay = unmountDelay - 500,
) => {
  const [isMounted, setIsMounted] = useState(() => {
    return !sessionStorage.getItem('splash_seen');
  });
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!isMounted) return;

    sessionStorage.setItem('splash_seen', 'true');

    const fadeTimer = setTimeout(() => setIsFading(true), fadeDelay);
    const unmountTimer = setTimeout(() => setIsMounted(false), unmountDelay);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, [isMounted, fadeDelay, unmountDelay]);

  return { isMounted, isFading };
};
