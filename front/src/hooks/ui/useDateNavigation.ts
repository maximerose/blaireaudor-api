import { useRef, useState, useEffect } from 'react';

export const useDateNavigation = (dates: string[]) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showMask, setShowMask] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 20;
      const canScroll = scrollWidth > clientWidth;
      setShowMask(canScroll && !isAtEnd);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [dates]);

  return {
    scrollRef,
    showMask,
    handleScroll,
  };
};
