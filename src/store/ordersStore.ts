'use client';

import { create } from 'zustand';
import { Order, CartItem, OrderCustomer, OrderShipping } from '@/types';
import { storageGet, storageSet, KEYS } from '@/lib/storage';
import { generateOrderId } from '@/lib/utils';

interface OrdersState {
  orders: Order[];
  initialized: boolean;

  // Actions
  init: () => void;
  createOrder: (params: {
    items: CartItem[];
    customer: OrderCustomer;
    shipping: OrderShipping;
    subtotal: number;
    shippingCost: number;
    total: number;
  }) => Order;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  getOrder: (id: string) => Order | undefined;

  // Stats
  totalRevenue: () => number;
  totalOrders: () => number;
}

// Seed some mock historic orders for the admin dashboard
const SEED_ORDERS: Order[] = [
  {
    id: 'ORD-ABC123',
    items: [],
    customer: { name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 555 0101' },
    shipping: { address: '123 Maple Ave', city: 'San Francisco', state: 'CA', postalCode: '94102', country: 'US' },
    subtotal: 1298,
    shippingCost: 0,
    total: 1298,
    status: 'delivered',
    createdAt: '2024-06-01T10:23:00.000Z',
  },
  {
    id: 'ORD-DEF456',
    items: [],
    customer: { name: 'Marcus Lee', email: 'marcus@example.com' },
    shipping: { address: '456 Oak Blvd', city: 'Austin', state: 'TX', postalCode: '78701', country: 'US' },
    subtotal: 799,
    shippingCost: 0,
    total: 799,
    status: 'shipped',
    createdAt: '2024-06-08T14:45:00.000Z',
  },
  {
    id: 'ORD-GHI789',
    items: [],
    customer: { name: 'Sara Chen', email: 'sara@example.com', phone: '+1 555 0303' },
    shipping: { address: '789 Birch St', city: 'New York', state: 'NY', postalCode: '10001', country: 'US' },
    subtotal: 2499,
    shippingCost: 0,
    total: 2499,
    status: 'processing',
    createdAt: '2024-06-12T09:15:00.000Z',
  },
  {
    id: 'ORD-JKL012',
    items: [],
    customer: { name: 'Tom García', email: 'tom@example.com' },
    shipping: { address: '1 Market St', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'US' },
    subtotal: 349,
    shippingCost: 15,
    total: 364,
    status: 'pending',
    createdAt: '2024-06-15T17:30:00.000Z',
  },
];

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  initialized: false,

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

  createOrder: ({ items, customer, shipping, subtotal, shippingCost, total }) => {
    const order: Order = {
      id: generateOrderId(),
      items,
      customer,
      shipping,
      subtotal,
      shippingCost,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    set((state) => {
      const updated = [order, ...state.orders];
      storageSet(KEYS.ORDERS, updated);
      return { orders: updated };
    });
    return order;
  },

  updateOrderStatus: (id, status) => {
    set((state) => {
      const updated = state.orders.map((o) => (o.id === id ? { ...o, status } : o));
      storageSet(KEYS.ORDERS, updated);
      return { orders: updated };
    });
  },

  getOrder: (id) => get().orders.find((o) => o.id === id),

  totalRevenue: () => get().orders.reduce((sum, o) => sum + o.total, 0),
  totalOrders: () => get().orders.length,
}));
