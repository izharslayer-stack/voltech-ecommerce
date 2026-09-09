'use client';

import { useEffect, useState } from 'react';

/**
 * Renders children only on the client, after hydration.
 * Use this around anything that reads localStorage / Zustand stores
 * to prevent SSR mismatches and 500 errors.
 */
export default function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : <>{fallback}</>;
}
