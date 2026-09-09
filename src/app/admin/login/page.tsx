'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('admin@voltech.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace('/admin');
  }, [isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) router.replace('/admin');
  }

  return (
    <div className="min-h-screen bg-[#F7F6F1] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="h-8 w-8 bg-[#171717] flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-serif text-2xl text-[#171717]">Voltech</span>
          <span className="text-xs text-[#6F6F68] ml-1 mt-0.5">Admin</span>
        </div>

        <h1 className="font-serif text-3xl text-[#171717] mb-1">Sign in</h1>
        <p className="text-sm text-[#6F6F68] mb-8">
          Demo: <code className="text-xs bg-[#E5E3DC] px-1.5 py-0.5">admin@voltech.com</code> /{' '}
          <code className="text-xs bg-[#E5E3DC] px-1.5 py-0.5">admin123</code>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#171717] uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border border-[#E5E3DC] px-4 py-3 text-sm text-[#171717] focus:outline-none focus:border-[#315C45] transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#171717] uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#E5E3DC] px-4 py-3 pr-11 text-sm text-[#171717] focus:outline-none focus:border-[#315C45] transition-colors"
                required
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

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#171717] text-white text-sm py-3.5 hover:bg-[#315C45] transition-colors disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
