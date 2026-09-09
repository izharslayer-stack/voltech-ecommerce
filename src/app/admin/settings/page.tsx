'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import Button from '@/components/ui/Button';

export default function AdminSettingsPage() {
  const { user } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  return (
    <div className="flex flex-col gap-8 max-w-xl">
      <div>
        <h1 className="font-serif text-3xl text-[#171717]">Settings</h1>
        <p className="text-sm text-[#6F6F68] mt-0.5">Manage your account</p>
      </div>

      <section className="bg-white border border-[#E5E3DC] p-6">
        <h2 className="text-xs font-semibold tracking-widest text-[#6F6F68] uppercase mb-5">
          Profile
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#171717] uppercase tracking-wide">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white border border-[#E5E3DC] px-4 py-3 text-sm text-[#171717] focus:outline-none focus:border-[#315C45] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#171717] uppercase tracking-wide">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border border-[#E5E3DC] px-4 py-3 text-sm text-[#171717] focus:outline-none focus:border-[#315C45] transition-colors"
            />
          </div>
          <Button
            variant="primary"
            onClick={() => addToast('Settings saved (demo mode)')}
            className="self-start"
          >
            Save Changes
          </Button>
        </div>
      </section>

      <section className="bg-white border border-[#E5E3DC] p-6">
        <h2 className="text-xs font-semibold tracking-widest text-[#6F6F68] uppercase mb-3">
          Demo Credentials
        </h2>
        <p className="text-sm text-[#6F6F68] leading-relaxed">
          This is a demo admin with frontend-only authentication. To use in production,
          replace <code className="bg-[#F7F6F1] px-1.5 py-0.5 text-xs">src/store/authStore.ts</code> with
          a real authentication service (NextAuth.js, Clerk, Supabase Auth, etc.).
        </p>
        <div className="mt-3 bg-[#F7F6F1] border border-[#E5E3DC] px-4 py-3 text-xs font-mono text-[#6F6F68]">
          <p>Email: admin@voltech.com</p>
          <p>Password: admin123</p>
        </div>
      </section>
    </div>
  );
}
