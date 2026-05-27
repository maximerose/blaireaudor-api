import { useState, useEffect } from 'react';

export const useSplashScreen = (fadeDelay = 1500, unmountDelay = 2000) => {
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
