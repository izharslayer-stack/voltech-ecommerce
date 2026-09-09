/**
 * Generic localStorage abstraction.
 * Replace the read/write functions here to switch to a real backend.
 */

const PREFIX = 'voltech_';

export function storageGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function storageSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // quota exceeded or private mode – fail silently
  }
}

export function storageRemove(key: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PREFIX + key);
}

export const KEYS = {
  PRODUCTS: 'products',
  CART: 'cart',
  ORDERS: 'orders',
  ADMIN_AUTH: 'admin_auth',
  CUSTOMER_AUTH: 'customer_auth',
  CUSTOMERS: 'customers',
} as const;
