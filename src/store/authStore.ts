'use client';

import { create } from 'zustand';
import { AdminUser } from '@/types';
import { storageGet, storageSet, storageRemove, KEYS } from '@/lib/storage';

/**
 * DEMO-ONLY authentication.
 * Replace `validateCredentials` with a real API call for production.
 */

const DEMO_CREDENTIALS = {
  email: 'admin@voltech.com',
  password: 'admin123',
};

const DEMO_USER: AdminUser = {
  email: 'admin@voltech.com',
  name: 'Admin User',
};

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  init: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  init: () => {
    const stored = storageGet<AdminUser | null>(KEYS.ADMIN_AUTH, null);
    if (stored) {
      set({ user: stored, isAuthenticated: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    if (
      email.toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      storageSet(KEYS.ADMIN_AUTH, DEMO_USER);
      set({ user: DEMO_USER, isAuthenticated: true, isLoading: false });
      return true;
    }

    set({ error: 'Invalid email or password.', isLoading: false });
    return false;
  },

  logout: () => {
    storageRemove(KEYS.ADMIN_AUTH);
    set({ user: null, isAuthenticated: false });
  },
}));
