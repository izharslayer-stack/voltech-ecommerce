'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart2,
  Settings, LogOut, Zap, X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();

  function handleLogout() {
    logout();
    router.push('/admin/login');
  }

  function isActive(item: typeof NAV[0]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <aside className="h-full flex flex-col bg-[#171717] text-white w-64">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="h-7 w-7 bg-[#315C45] flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-serif text-lg">Voltech</span>
          <span className="text-[10px] text-neutral-500 ml-0.5">Admin</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-neutral-400 hover:text-white lg:hidden">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-none',
              isActive(item)
                ? 'bg-white/10 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User + logout */}
      <div className="border-t border-neutral-800 px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 bg-[#315C45] flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0) ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{user?.name ?? 'Admin'}</p>
            <p className="text-[10px] text-neutral-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors w-full"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
