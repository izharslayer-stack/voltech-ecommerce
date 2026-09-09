'use client';

import { create } from 'zustand';
import { Product } from '@/types';
import { storageGet, storageSet, KEYS } from '@/lib/storage';
import { DEFAULT_PRODUCTS } from '@/lib/defaultProducts';
import { generateId, slugify } from '@/lib/utils';

interface ProductsState {
  products: Product[];
  initialized: boolean;

  // Actions
  init: () => void;
  addProduct: (data: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (idOrSlug: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getFeaturedProducts: () => Product[];
  getCategories: () => string[];
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  initialized: false,

  init: () => {
    if (get().initialized) return;
    const stored = storageGet<Product[]>(KEYS.PRODUCTS, []);
    if (stored.length === 0) {
      // First run — seed defaults
      storageSet(KEYS.PRODUCTS, DEFAULT_PRODUCTS);
      set({ products: DEFAULT_PRODUCTS, initialized: true });
    } else {
      set({ products: stored, initialized: true });
    }
  },

  addProduct: (data) => {
    const newProduct: Product = {
      ...data,
      id: generateId(),
      slug: data.slug || slugify(data.name),
      createdAt: new Date().toISOString(),
    };
    set((state) => {
      const updated = [newProduct, ...state.products];
      storageSet(KEYS.PRODUCTS, updated);
      return { products: updated };
    });
    return newProduct;
  },

  updateProduct: (id, data) => {
    set((state) => {
      const updated = state.products.map((p) =>
        p.id === id
          ? {
              ...p,
              ...data,
              slug: data.name ? (data.slug || slugify(data.name)) : p.slug,
            }
          : p
      );
      storageSet(KEYS.PRODUCTS, updated);
      return { products: updated };
    });
  },

  deleteProduct: (id) => {
    set((state) => {
      const updated = state.products.filter((p) => p.id !== id);
      storageSet(KEYS.PRODUCTS, updated);
      return { products: updated };
    });
  },

  getProduct: (idOrSlug) => {
    const { products } = get();
    return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  },

  getProductsByCategory: (category) => {
    const { products } = get();
    if (!category || category === 'All') return products.filter((p) => p.status === 'active');
    return products.filter((p) => p.category === category && p.status === 'active');
  },

  getFeaturedProducts: () => {
    return get().products.filter((p) => p.featured && p.status === 'active');
  },

  getCategories: () => {
    const cats = get().products.map((p) => p.category);
    return ['All', ...Array.from(new Set(cats))];
  },
}));
