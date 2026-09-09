'use client';

import { create } from 'zustand';
import { CustomerUser } from '@/types';
import { storageGet, storageSet, storageRemove, KEYS } from '@/lib/storage';

// Registered customers are stored as a map of email → { user, passwordHash }
interface StoredCustomer {
  user: CustomerUser;
  password: string; // plain text — demo only, use bcrypt in production
}

function getCustomers(): Record<string, StoredCustomer> {
  return storageGet<Record<string, StoredCustomer>>(KEYS.CUSTOMERS, {});
}

function saveCustomers(customers: Record<string, StoredCustomer>) {
  storageSet(KEYS.CUSTOMERS, customers);
}

interface CustomerAuthState {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  init: () => void;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useCustomerAuthStore = create<CustomerAuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  init: () => {
    const stored = storageGet<CustomerUser | null>(KEYS.CUSTOMER_AUTH, null);
    if (stored) set({ user: stored, isAuthenticated: true });
  },

  signup: async (firstName, lastName, email, password) => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 600));

    const customers = getCustomers();
    const key = email.toLowerCase();

    if (customers[key]) {
      set({ error: 'An account with this email already exists.', isLoading: false });
      return false;
    }

    if (password.length < 6) {
      set({ error: 'Password must be at least 6 characters.', isLoading: false });
      return false;
    }

    const user: CustomerUser = {
      id: `cust_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      email: key,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      createdAt: new Date().toISOString(),
    };

    customers[key] = { user, password };
    saveCustomers(customers);
    storageSet(KEYS.CUSTOMER_AUTH, user);

    set({ user, isAuthenticated: true, isLoading: false });
    return true;
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 600));

    const customers = getCustomers();
    const key = email.toLowerCase();
    const record = customers[key];

    if (!record || record.password !== password) {
      set({ error: 'Invalid email or password.', isLoading: false });
      return false;
    }

    storageSet(KEYS.CUSTOMER_AUTH, record.user);
    set({ user: record.user, isAuthenticated: true, isLoading: false });
    return true;
  },

  logout: () => {
    storageRemove(KEYS.CUSTOMER_AUTH);
    set({ user: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));
