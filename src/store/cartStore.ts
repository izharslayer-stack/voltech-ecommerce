'use client';

import { create } from 'zustand';
import { CartItem, Product } from '@/types';
import { storageGet, storageSet, KEYS } from '@/lib/storage';

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  init: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed
  totalItems: () => number;
  subtotal: () => number;
  shippingCost: () => number;
  total: () => number;
}

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 15;

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  init: () => {
    const stored = storageGet<CartItem[]>(KEYS.CART, []);
    set({ items: stored });
  },

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = state.items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
            : i
        );
      } else {
        updated = [...state.items, { product, quantity }];
      }
      storageSet(KEYS.CART, updated);
      return { items: updated, isOpen: true };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const updated = state.items.filter((i) => i.product.id !== productId);
      storageSet(KEYS.CART, updated);
      return { items: updated };
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity < 1) {
      get().removeItem(productId);
      return;
    }
    set((state) => {
      const updated = state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      );
      storageSet(KEYS.CART, updated);
      return { items: updated };
    });
  },

  clearCart: () => {
    storageSet(KEYS.CART, []);
    set({ items: [] });
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  subtotal: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

  shippingCost: () => {
    const sub = get().subtotal();
    return sub === 0 ? 0 : sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  },

  total: () => get().subtotal() + get().shippingCost(),
}));
