'use client';

import { create } from 'zustand';

interface UIState {
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  isMobileMenuOpen: false,
  openSearch: () => set({ isSearchOpen: true, isMobileMenuOpen: false }),
  closeSearch: () => set({ isSearchOpen: false }),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));
