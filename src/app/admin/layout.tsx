'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, init } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-[#F7F6F1] overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 flex-shrink-0">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-[#E5E3DC] px-4 sm:px-6 py-4 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex-shrink-0 text-[#6F6F68] hover:text-[#171717] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1 flex items-center gap-3 bg-[#F7F6F1] border border-[#E5E3DC] px-3 py-2 max-w-[160px] sm:max-w-xs md:max-w-sm">
            <Search className="h-4 w-4 text-[#6F6F68] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search…"
              className="bg-transparent text-sm text-[#171717] placeholder-[#6F6F68] focus:outline-none flex-1 min-w-0"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative text-[#6F6F68] hover:text-[#171717] transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-[#315C45] rounded-full text-[8px] text-white flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
