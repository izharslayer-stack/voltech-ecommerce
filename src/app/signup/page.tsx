'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCustomerAuthStore } from '@/store/customerAuthStore';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated, isLoading, error, clearError } = useCustomerAuthStore();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (isAuthenticated) router.replace('/account');
  }, [isAuthenticated, router]);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setLocalError('');
    clearError();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }
    if (form.password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    const ok = await signup(form.firstName, form.lastName, form.email, form.password);
    if (ok) router.replace('/account');
  }

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'][passwordStrength];
  const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-[#315C45]', 'bg-[#315C45]'][passwordStrength];

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-[#F7F6F1] flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#315C45] flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-white flex items-center justify-center">
            <Zap className="h-5 w-5 text-[#315C45]" />
          </div>
          <span className="font-serif text-2xl text-white">Voltech</span>
        </Link>

        <div>
          <p className="font-serif text-5xl text-white leading-tight mb-6">
            Join the<br />
            <em className="not-italic text-[#DCE7DD]">community.</em>
          </p>
          <div className="flex flex-col gap-3">
            {[
              'Track your orders in real time',
              'Faster checkout — saved details',
              'Exclusive member discounts',
              'Early access to new arrivals',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#DCE7DD] flex-shrink-0" />
                <span className="text-sm text-white/80">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-xs">
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

          <h1 className="font-serif text-3xl text-[#171717] mb-1">Create account</h1>
          <p className="text-sm text-[#6F6F68] mb-8">
            Already have an account?{' '}
            <Link href="/login" className="text-[#315C45] hover:underline font-medium">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#171717] uppercase tracking-widest">
                  First name
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  placeholder="Jane"
                  className="bg-white border border-[#E5E3DC] px-4 py-3 text-sm text-[#171717] placeholder-[#B0ADA6] focus:outline-none focus:border-[#315C45] transition-colors"
                  required
                  autoComplete="given-name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#171717] uppercase tracking-widest">
                  Last name
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  placeholder="Doe"
                  className="bg-white border border-[#E5E3DC] px-4 py-3 text-sm text-[#171717] placeholder-[#B0ADA6] focus:outline-none focus:border-[#315C45] transition-colors"
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#171717] uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="you@example.com"
                className="bg-white border border-[#E5E3DC] px-4 py-3 text-sm text-[#171717] placeholder-[#B0ADA6] focus:outline-none focus:border-[#315C45] transition-colors"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#171717] uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-white border border-[#E5E3DC] px-4 py-3 pr-11 text-sm text-[#171717] placeholder-[#B0ADA6] focus:outline-none focus:border-[#315C45] transition-colors"
                  required
                  autoComplete="new-password"
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
              {/* Strength meter */}
              {form.password && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          i <= passwordStrength ? strengthColor : 'bg-[#E5E3DC]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#6F6F68]">{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#171717] uppercase tracking-widest">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  placeholder="Repeat password"
                  className="w-full bg-white border border-[#E5E3DC] px-4 py-3 pr-11 text-sm text-[#171717] placeholder-[#B0ADA6] focus:outline-none focus:border-[#315C45] transition-colors"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6F68] hover:text-[#171717] transition-colors"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Match indicator */}
              {form.confirmPassword && (
                <p className={`text-xs mt-0.5 ${form.password === form.confirmPassword ? 'text-[#315C45]' : 'text-red-500'}`}>
                  {form.password === form.confirmPassword ? '✓ Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>

            {/* Error */}
            {displayError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2.5"
              >
                {displayError}
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
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-xs text-[#6F6F68] text-center">
              By creating an account you agree to our{' '}
              <span className="text-[#315C45]">Terms of Service</span> and{' '}
              <span className="text-[#315C45]">Privacy Policy</span>.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
