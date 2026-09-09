'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, X, Zap, LogOut, Package, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { useScrolled } from '@/hooks/useScrolled';
import { useCustomerAuthStore } from '@/store/customerAuthStore';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Shop',        href: '/shop'    },
  { label: 'Collections', href: '/shop'    },
  { label: 'About',       href: '/about'   },
  { label: 'Journal',     href: '/journal' },
];

export default function Navbar() {
  const router = useRouter();
  const scrolled = useScrolled(32);
  const { openCart, totalItems } = useCartStore();
  const { openSearch, isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useUIStore();
  const { user, isAuthenticated, logout } = useCustomerAuthStore();
  const count = totalItems();

  const [accountOpen, setAccountOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleLogout() {
    logout();
    setAccountOpen(false);
    router.push('/');
  }

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '';

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[#F7F6F1]/95 backdrop-blur-md border-b border-[#E5E3DC] py-3'
            : 'bg-transparent py-5'
        )}
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-7 w-7 bg-[#1a1a1a] flex items-center justify-center group-hover:bg-[#315C45] transition-colors duration-300">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-serif text-xl tracking-tight text-[#171717]" style={{ fontFamily: 'var(--font-serif)' }}>
              Voltech
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-[#6F6F68] hover:text-[#171717] transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#315C45] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">

            {/* Search */}
            <button
              onClick={openSearch}
              className="h-9 w-9 flex items-center justify-center text-[#6F6F68] hover:text-[#171717] transition-colors"
              aria-label="Search"
            >
              <Search style={{ width: 18, height: 18 }} />
            </button>

            {/* Account — desktop */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              {isAuthenticated && user ? (
                /* Logged-in avatar button */
                <button
                  onClick={() => setAccountOpen((o) => !o)}
                  aria-expanded={accountOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-1.5 h-9 px-2 text-[#6F6F68] hover:text-[#171717] transition-colors"
                  aria-label="Account menu"
                >
                  <div className="h-6 w-6 bg-[#171717] text-white text-[10px] font-bold flex items-center justify-center">
                    {initials}
                  </div>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${accountOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              ) : (
                /* Guest icon button */
                <button
                  onClick={() => setAccountOpen((o) => !o)}
                  aria-expanded={accountOpen}
                  aria-haspopup="true"
                  className="h-9 w-9 flex items-center justify-center text-[#6F6F68] hover:text-[#171717] transition-colors"
                  aria-label="Account"
                >
                  <User style={{ width: 18, height: 18 }} />
                </button>
              )}

              {/* Dropdown */}
              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#E5E3DC] shadow-lg z-50"
                  >
                    {isAuthenticated && user ? (
                      <>
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-[#E5E3DC]">
                          <p className="text-xs font-semibold text-[#171717] truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-[#6F6F68] truncate mt-0.5">{user.email}</p>
                        </div>
                        {/* Links */}
                        <div className="py-1">
                          <DropdownLink
                            href="/account"
                            icon={User}
                            label="My Account"
                            onClick={() => setAccountOpen(false)}
                          />
                          <DropdownLink
                            href="/account"
                            icon={Package}
                            label="My Orders"
                            onClick={() => setAccountOpen(false)}
                          />
                        </div>
                        <div className="border-t border-[#E5E3DC] py-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="py-1">
                          <DropdownLink
                            href="/login"
                            icon={User}
                            label="Sign In"
                            onClick={() => setAccountOpen(false)}
                          />
                          <DropdownLink
                            href="/signup"
                            icon={Zap}
                            label="Create Account"
                            onClick={() => setAccountOpen(false)}
                          />
                        </div>
                        <div className="border-t border-[#E5E3DC] py-1">
                          <DropdownLink
                            href="/admin/login"
                            icon={Package}
                            label="Admin Panel"
                            onClick={() => setAccountOpen(false)}
                          />
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <button
              onClick={openCart}
              className="h-9 w-9 flex items-center justify-center text-[#6F6F68] hover:text-[#171717] transition-colors relative"
              aria-label={`Cart, ${count} items`}
            >
              <ShoppingCart style={{ width: 18, height: 18 }} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-[#315C45] text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {count > 9 ? '9+' : count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="h-9 w-9 md:hidden flex items-center justify-center text-[#6F6F68] hover:text-[#171717] transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 bg-[#F7F6F1] flex flex-col pt-20 sm:pt-24 px-4 sm:px-6 pb-8 overflow-y-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Nav links */}
            <nav className="flex flex-col gap-5">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    className="font-serif text-3xl text-[#171717] hover:text-[#315C45] transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom section */}
            <div className="mt-auto border-t border-[#E5E3DC] pt-6 flex flex-col gap-3">
              {isAuthenticated && user ? (
                <>
                  {/* Logged-in user */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 bg-[#171717] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#171717] truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-[#6F6F68] truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 text-sm text-[#6F6F68] hover:text-[#171717] transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <User className="h-4 w-4" /> My Account
                  </Link>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 text-sm text-[#6F6F68] hover:text-[#171717] transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <Package className="h-4 w-4" /> My Orders
                  </Link>
                  <button
                    onClick={() => { handleLogout(); closeMobileMenu(); }}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 bg-[#171717] text-white text-sm py-3 hover:bg-[#315C45] transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <User className="h-4 w-4" /> Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center justify-center gap-2 border border-[#171717] text-[#171717] text-sm py-3 hover:bg-[#171717] hover:text-white transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Create Account
                  </Link>
                  <Link
                    href="/admin/login"
                    className="flex items-center gap-2 text-xs text-[#6F6F68] hover:text-[#171717] transition-colors mt-1"
                    onClick={closeMobileMenu}
                  >
                    Admin Panel →
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Dropdown link helper ──────────────────────────────────────────────────────
function DropdownLink({
  href, icon: Icon, label, onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#6F6F68] hover:text-[#171717] hover:bg-[#F7F6F1] transition-colors"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
