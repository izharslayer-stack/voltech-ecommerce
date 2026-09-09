'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCustomerAuthStore } from '@/store/customerAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearError } = useCustomerAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace('/account');
  }, [isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    const ok = await login(email, password);
    if (ok) router.replace('/account');
  }

  return (
    <div className="min-h-screen bg-[#F7F6F1] flex">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#171717] flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-white flex items-center justify-center">
            <Zap className="h-5 w-5 text-[#171717]" />
          </div>
          <span className="font-serif text-2xl text-white">Voltech</span>
        </Link>

        <div>
          <p className="font-serif text-5xl text-white leading-tight mb-6">
            Welcome<br />
            <em className="not-italic text-[#DCE7DD]">back.</em>
          </p>
          <p className="text-[#6F6F68] text-sm leading-relaxed max-w-xs">
            Sign in to track your orders, manage your wishlist, and enjoy a faster checkout experience.
          </p>
        </div>

        <p className="text-[#6F6F68] text-xs">
          © {new Date().getFullYear()} Voltech. All rights reserved.
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="h-7 w-7 bg-[#171717] flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-serif text-xl text-[#171717]">Voltech</span>
          </Link>

          <h1 className="font-serif text-3xl text-[#171717] mb-1">Sign in</h1>
          <p className="text-sm text-[#6F6F68] mb-8">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#315C45] hover:underline font-medium">
              Create one
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#171717] uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-white border border-[#E5E3DC] px-4 py-3 text-sm text-[#171717] placeholder-[#B0ADA6] focus:outline-none focus:border-[#315C45] transition-colors"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#171717] uppercase tracking-widest">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#6F6F68] hover:text-[#315C45] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#E5E3DC] px-4 py-3 pr-11 text-sm text-[#171717] placeholder-[#B0ADA6] focus:outline-none focus:border-[#315C45] transition-colors"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6F68] hover:text-[#171717] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2.5"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-[#171717] text-white text-sm py-3.5 hover:bg-[#315C45] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-[#6F6F68]">
            Looking for the{' '}
            <Link href="/admin/login" className="text-[#315C45] hover:underline">
              Admin panel?
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
