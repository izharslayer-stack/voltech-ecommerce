'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';

/**
 * Renders storefront chrome (Navbar, CartDrawer, SearchOverlay)
 * only on non-admin routes.
 */
export default function StorefrontShell() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <>
      <Navbar />
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}
