'use client';

import { useEffect } from 'react';
import { useProductsStore } from '@/store/productsStore';
import { useCartStore } from '@/store/cartStore';
import { useOrdersStore } from '@/store/ordersStore';
import { useAuthStore } from '@/store/authStore';
import { useCustomerAuthStore } from '@/store/customerAuthStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  const initProducts = useProductsStore((s) => s.init);
  const initCart = useCartStore((s) => s.init);
  const initOrders = useOrdersStore((s) => s.init);
  const initAuth = useAuthStore((s) => s.init);
  const initCustomerAuth = useCustomerAuthStore((s) => s.init);

  useEffect(() => {
    initProducts();
    initCart();
    initOrders();
    initAuth();
    initCustomerAuth();
  }, [initProducts, initCart, initOrders, initAuth, initCustomerAuth]);

  return <>{children}</>;
}
