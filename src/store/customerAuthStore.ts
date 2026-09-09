'use client';

import { create } from 'zustand';
import { CustomerUser } from '@/types';

const TOKEN_KEY = 'voltech_token';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}
function saveToken(t: string) { localStorage.setItem(TOKEN_KEY, t); }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

interface CustomerAuthState {
  user: CustomerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  init: () => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useCustomerAuthStore = create<CustomerAuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Rehydrate from stored JWT on page load
  init: async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const user: CustomerUser = await res.json();
        set({ user, token, isAuthenticated: true });
      } else {
        clearToken();
      }
    } catch {
      clearToken();
    }
  },

  signup: async (firstName, lastName, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        set({ error: data.error ?? 'Signup failed.', isLoading: false });
        return false;
      }
      saveToken(data.token);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
      return true;
    } catch {
      set({ error: 'Network error. Please try again.', isLoading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        set({ error: data.error ?? 'Login failed.', isLoading: false });
        return false;
      }
      saveToken(data.token);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
      return true;
    } catch {
      set({ error: 'Network error. Please try again.', isLoading: false });
      return false;
    }
  },

  logout: () => {
    clearToken();
    set({ user: null, token: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));

// Helper to get auth header for other stores/API calls
export function getAuthHeader(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
