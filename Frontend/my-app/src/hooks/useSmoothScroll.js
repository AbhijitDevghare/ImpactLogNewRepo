import { useEffect, useCallback } from 'react';

export const useSmoothScroll = () => {
  useEffect(() => {
    // Enable smooth scrolling globally
    document.documentElement.style.scrollBehavior = 'smooth';

    // Optimize scroll performance
    const handleScroll = () => {
      // Throttle scroll events for better performance
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(() => {
          // Add any scroll-based optimizations here
        });
      }
    };

    // Passive scroll listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const scrollToElement = useCallback((elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  return { scrollToTop, scrollToElement };
};
