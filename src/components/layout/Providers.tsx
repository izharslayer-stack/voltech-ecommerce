'use client';

import { useEffect } from 'react';
import { useProductsStore } from '@/store/productsStore';
import { useCartStore } from '@/store/cartStore';
import { useOrdersStore } from '@/store/ordersStore';
import { useAuthStore } from '@/store/authStore';
import { useCustomerAuthStore } from '@/store/customerAuthStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  const initProducts     = useProductsStore((s) => s.init);
  const initCart         = useCartStore((s) => s.init);
  const initOrders       = useOrdersStore((s) => s.init);
  const fetchMyOrders    = useOrdersStore((s) => s.fetchMyOrders);
  const initAuth         = useAuthStore((s) => s.init);
  const initCustomerAuth = useCustomerAuthStore((s) => s.init);
  const isAuthenticated  = useCustomerAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    initProducts();
    initCart();
    initOrders();
    initAuth();
    initCustomerAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch real orders from DB whenever customer logs in
  useEffect(() => {
    if (isAuthenticated) fetchMyOrders();
  }, [isAuthenticated, fetchMyOrders]);

  return <>{children}</>;
}
