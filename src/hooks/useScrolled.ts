'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true once the page has scrolled past `threshold` pixels.
 */
export function useScrolled(threshold = 32): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    // Set initial value
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);

  return scrolled;
}
