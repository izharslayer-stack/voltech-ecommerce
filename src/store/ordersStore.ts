'use client';

import { create } from 'zustand';
import { Order, CartItem, OrderCustomer, OrderShipping } from '@/types';
import { storageGet, storageSet, KEYS } from '@/lib/storage';
import { generateOrderId } from '@/lib/utils';
import { getAuthHeader } from '@/store/customerAuthStore';

interface OrdersState {
  orders: Order[];
  initialized: boolean;
  isSyncing: boolean;

  init: () => void;
  fetchMyOrders: () => Promise<void>;
  createOrder: (params: {
    items: CartItem[];
    customer: OrderCustomer;
    shipping: OrderShipping;
    subtotal: number;
    shippingCost: number;
    total: number;
  }) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  getOrder: (id: string) => Order | undefined;

  totalRevenue: () => number;
  totalOrders: () => number;
}

// Seed orders kept for admin dashboard demo data
const SEED_ORDERS: Order[] = [
  {
    id: 'ORD-ABC123',
    items: [],
    customer: { name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 555 0101' },
    shipping: { address: '123 Maple Ave', city: 'San Francisco', state: 'CA', postalCode: '94102', country: 'US' },
    subtotal: 1298, shippingCost: 0, total: 1298,
    status: 'delivered', createdAt: '2024-06-01T10:23:00.000Z',
  },
  {
    id: 'ORD-DEF456',
    items: [],
    customer: { name: 'Marcus Lee', email: 'marcus@example.com' },
    shipping: { address: '456 Oak Blvd', city: 'Austin', state: 'TX', postalCode: '78701', country: 'US' },
    subtotal: 799, shippingCost: 0, total: 799,
    status: 'shipped', createdAt: '2024-06-08T14:45:00.000Z',
  },
  {
    id: 'ORD-GHI789',
    items: [],
    customer: { name: 'Sara Chen', email: 'sara@example.com', phone: '+1 555 0303' },
    shipping: { address: '789 Birch St', city: 'New York', state: 'NY', postalCode: '10001', country: 'US' },
    subtotal: 2499, shippingCost: 0, total: 2499,
    status: 'processing', createdAt: '2024-06-12T09:15:00.000Z',
  },
  {
    id: 'ORD-JKL012',
    items: [],
    customer: { name: 'Tom García', email: 'tom@example.com' },
    shipping: { address: '1 Market St', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'US' },
    subtotal: 349, shippingCost: 15, total: 364,
    status: 'pending', createdAt: '2024-06-15T17:30:00.000Z',
  },
];

// Shape returned by the API — map to the frontend Order type
function mapApiOrder(o: Record<string, unknown>): Order {
  const items = (o.items as Record<string, unknown>[] ?? []).map((i) => ({
    product: {
      id:          (i.productId  as string) ?? '',
      name:        (i.productName as string) ?? '',
      image:       (i.productImage as string) ?? '',
      category:    (i.productCategory as string) ?? '',
      price:       Number(i.unitPrice),
      slug:        '',
      description: '',
      stock:       0,
      featured:    false,
      status:      'active' as const,
      createdAt:   '',
    },
    quantity: i.quantity as number,
  }));

  return {
    id:          o.id as string,
    items,
    customer: {
      name:  o.customerName  as string,
      email: o.customerEmail as string,
      phone: (o.customerPhone as string | undefined),
    },
    shipping: {
      address:    o.shippingAddress as string,
      city:       o.shippingCity    as string,
      state:      (o.shippingState  as string | undefined),
      postalCode: o.shippingPostal  as string,
      country:    o.shippingCountry as string,
    },
    subtotal:     Number(o.subtotal),
    shippingCost: Number(o.shippingCost),
    total:        Number(o.total),
    status:       o.status as Order['status'],
    createdAt:    o.createdAt as string,
  };
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  initialized: false,
  isSyncing: false,

  // Load from localStorage (for admin) — real orders fetched per-user via fetchMyOrders
  init: () => {
    if (get().initialized) return;
    const stored = storageGet<Order[]>(KEYS.ORDERS, []);
    if (stored.length === 0) {
      storageSet(KEYS.ORDERS, SEED_ORDERS);
      set({ orders: SEED_ORDERS, initialized: true });
    } else {
      set({ orders: stored, initialized: true });
    }
  },

  // Fetch authenticated customer's orders from the database
  fetchMyOrders: async () => {
    const headers = getAuthHeader();
    if (!headers.Authorization) return;
    set({ isSyncing: true });
    try {
      const res = await fetch('/api/orders', { headers });
      if (res.ok) {
        const data = await res.json();
        const apiOrders: Order[] = (data.orders as Record<string, unknown>[]).map(mapApiOrder);
        // Merge with existing local orders without duplicates
        set((state) => {
          const ids = new Set(apiOrders.map((o) => o.id));
          const local = state.orders.filter((o) => !ids.has(o.id));
          const merged = [...apiOrders, ...local];
          return { orders: merged, isSyncing: false };
        });
      }
    } catch {
      // Non-fatal — fallback to localStorage data
    } finally {
      set({ isSyncing: false });
    }
  },

  createOrder: async ({ items, customer, shipping, subtotal, shippingCost, total }) => {
    const id = generateOrderId();
    const orderPayload = { id, items, customer, shipping, subtotal, shippingCost, total };

    // Optimistic local order
    const localOrder: Order = {
      id, items, customer, shipping,
      subtotal, shippingCost, total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const updated = [localOrder, ...state.orders];
      storageSet(KEYS.ORDERS, updated);
      return { orders: updated };
    });

    // Persist to database
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(orderPayload),
      });
      if (!res.ok) {
        console.warn('[createOrder] API failed, order saved locally only');
      }
    } catch {
      console.warn('[createOrder] Network error, order saved locally only');
    }

    return localOrder;
  },

  updateOrderStatus: (id, status) => {
    set((state) => {
      const updated = state.orders.map((o) => (o.id === id ? { ...o, status } : o));
      storageSet(KEYS.ORDERS, updated);
      return { orders: updated };
    });
    // Also update in DB
    fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  },

  getOrder: (id) => get().orders.find((o) => o.id === id),
  totalRevenue: () => get().orders.reduce((sum, o) => sum + o.total, 0),
  totalOrders: () => get().orders.length,
}));
