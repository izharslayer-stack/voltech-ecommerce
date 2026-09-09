'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User, Package, LogOut, ChevronRight,
  ShoppingBag, MapPin, Settings, ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCustomerAuthStore } from '@/store/customerAuthStore';
import { useOrdersStore } from '@/store/ordersStore';
import { formatPrice } from '@/lib/utils';
import { Order } from '@/types';
import Footer from '@/components/layout/Footer';

const STATUS_STYLES: Record<Order['status'], string> = {
  pending:    'bg-yellow-50 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped:    'bg-purple-50 text-purple-700 border-purple-200',
  delivered:  'bg-[#DCE7DD] text-[#315C45] border-[#C2D4C4]',
};

type Tab = 'overview' | 'orders' | 'profile';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useCustomerAuthStore();
  const { orders } = useOrdersStore();
  const [tab, setTab] = useState<Tab>('overview');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!user) return null;

  // Filter orders that belong to this customer (matched by email)
  const myOrders = orders.filter(
    (o) => o.customer.email.toLowerCase() === user.email.toLowerCase()
  );

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  function handleLogout() {
    logout();
    router.replace('/');
  }

  return (
    <>
      <div className="min-h-screen bg-[#F7F6F1] pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="h-14 w-14 bg-[#171717] text-white flex items-center justify-center font-serif text-xl flex-shrink-0">
                {initials}
              </div>
              <div>
                <h1 className="font-serif text-2xl text-[#171717]">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-xs text-[#6F6F68] mt-0.5">{user.email} · Member since {memberSince}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-[#6F6F68] hover:text-red-500 transition-colors self-start sm:self-auto"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-0 border-b border-[#E5E3DC] mb-8">
            {([
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'orders',   label: 'Orders',   icon: Package },
              { id: 'profile',  label: 'Profile',  icon: Settings },
            ] as { id: Tab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors ${
                  tab === id
                    ? 'border-[#171717] text-[#171717] font-medium'
                    : 'border-transparent text-[#6F6F68] hover:text-[#171717]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* ── Overview Tab ── */}
          {tab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Total Orders', value: myOrders.length },
                  {
                    label: 'Total Spent',
                    value: formatPrice(myOrders.reduce((s, o) => s + o.total, 0)),
                  },
                  {
                    label: 'Last Order',
                    value: myOrders.length
                      ? new Date(myOrders[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : '—',
                  },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white p-5">
                    <p className="text-xs text-[#6F6F68] uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="font-serif text-2xl text-[#171717]">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Quick links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {[
                  { icon: Package, label: 'View all orders', sub: `${myOrders.length} order${myOrders.length !== 1 ? 's' : ''}`, action: () => setTab('orders') },
                  { icon: ShoppingBag, label: 'Continue shopping', sub: 'Browse new arrivals', action: () => router.push('/shop') },
                  { icon: MapPin, label: 'Shipping addresses', sub: 'Manage saved addresses', action: () => setTab('profile') },
                  { icon: Settings, label: 'Account settings', sub: 'Update your profile', action: () => setTab('profile') },
                ].map(({ icon: Icon, label, sub, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="flex items-center gap-4 bg-white p-5 text-left hover:bg-[#F7F6F1] transition-colors group"
                  >
                    <div className="h-10 w-10 bg-[#F7F6F1] flex items-center justify-center flex-shrink-0 group-hover:bg-[#DCE7DD] transition-colors">
                      <Icon className="h-4 w-4 text-[#315C45]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#171717]">{label}</p>
                      <p className="text-xs text-[#6F6F68] mt-0.5">{sub}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#6F6F68] group-hover:text-[#171717] transition-colors" />
                  </button>
                ))}
              </div>

              {/* Recent orders preview */}
              {myOrders.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-lg text-[#171717]">Recent Orders</h2>
                    <button
                      onClick={() => setTab('orders')}
                      className="text-xs text-[#315C45] flex items-center gap-1 hover:underline"
                    >
                      View all <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {myOrders.slice(0, 3).map((order) => (
                      <OrderRow key={order.id} order={order} />
                    ))}
                  </div>
                </div>
              )}

              {myOrders.length === 0 && (
                <div className="text-center py-16 bg-white">
                  <ShoppingBag className="h-12 w-12 text-[#E5E3DC] mx-auto mb-3" />
                  <p className="font-serif text-xl text-[#171717] mb-2">No orders yet</p>
                  <p className="text-sm text-[#6F6F68] mb-6">Start shopping to see your orders here.</p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-[#171717] text-white text-sm px-6 py-3 hover:bg-[#315C45] transition-colors"
                  >
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Orders Tab ── */}
          {tab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-serif text-xl text-[#171717] mb-5">Order History</h2>
              {myOrders.length === 0 ? (
                <div className="text-center py-16 bg-white">
                  <ShoppingBag className="h-12 w-12 text-[#E5E3DC] mx-auto mb-3" />
                  <p className="font-serif text-xl text-[#171717] mb-2">No orders yet</p>
                  <p className="text-sm text-[#6F6F68] mb-6">Your completed orders will appear here.</p>
                  <Link href="/shop" className="inline-flex items-center gap-2 bg-[#171717] text-white text-sm px-6 py-3 hover:bg-[#315C45] transition-colors">
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {myOrders.map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <OrderRow order={order} expanded />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Profile Tab ── */}
          {tab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-md"
            >
              <h2 className="font-serif text-xl text-[#171717] mb-5">Profile Details</h2>
              <div className="bg-white p-6 flex flex-col gap-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-[#171717] text-white flex items-center justify-center font-serif text-2xl">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#171717]">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-[#6F6F68]">Member since {memberSince}</p>
                  </div>
                </div>

                <div className="border-t border-[#E5E3DC]" />

                {/* Info fields */}
                {[
                  { label: 'First name', value: user.firstName },
                  { label: 'Last name',  value: user.lastName  },
                  { label: 'Email',      value: user.email     },
                  { label: 'Account ID', value: user.id        },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-semibold text-[#6F6F68] uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-sm text-[#171717] break-all">{value}</p>
                  </div>
                ))}

                <div className="border-t border-[#E5E3DC] pt-2">
                  <p className="text-xs text-[#6F6F68]">
                    To update your name, email, or password, contact support. Full profile editing coming soon.
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-4 flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out of account
              </button>
            </motion.div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}

// ── Reusable order row ──────────────────────────────────────────────────────
function OrderRow({ order, expanded = false }: { order: Order; expanded?: boolean }) {
  const [open, setOpen] = useState(expanded);

  return (
    <div className="bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 p-5 text-left hover:bg-[#F7F6F1] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium text-[#171717]">{order.id}</p>
            <span className={`text-[10px] font-semibold uppercase tracking-wide border px-2 py-0.5 ${STATUS_STYLES[order.status]}`}>
              {order.status}
            </span>
          </div>
          <p className="text-xs text-[#6F6F68] mt-1">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm font-semibold text-[#171717]">
            {formatPrice(order.total)}
          </p>
          <ChevronRight className={`h-4 w-4 text-[#6F6F68] transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {open && order.items.length > 0 && (
        <div className="border-t border-[#E5E3DC] px-5 pb-5">
          <div className="flex flex-col divide-y divide-[#F7F6F1] mt-4">
            {order.items.map((item) => (
              <div key={item.product.id} className="flex gap-3 py-3">
                <div className="h-14 w-14 flex-shrink-0 bg-[#F7F6F1] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#171717] truncate">{item.product.name}</p>
                  <p className="text-xs text-[#6F6F68]">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm text-[#171717] font-medium whitespace-nowrap">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-semibold text-[#171717] pt-3 border-t border-[#E5E3DC]">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      {open && order.items.length === 0 && (
        <div className="border-t border-[#E5E3DC] px-5 py-4">
          <p className="text-xs text-[#6F6F68]">No item details available for this order.</p>
        </div>
      )}
    </div>
  );
}
