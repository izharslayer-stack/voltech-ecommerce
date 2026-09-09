'use client';

import { useOrdersStore } from '@/store/ordersStore';
import { useProductsStore } from '@/store/productsStore';
import { formatPrice } from '@/lib/utils';
import { TrendingUp, ShoppingBag, Package, Users } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { orders, totalRevenue } = useOrdersStore();
  const { products } = useProductsStore();

  const revenue = totalRevenue();
  const avgOrderValue = orders.length > 0 ? revenue / orders.length : 0;

  // Orders by status
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Products by category
  const catCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxCat = Math.max(...Object.values(catCounts));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl text-[#171717]">Analytics</h1>
        <p className="text-sm text-[#6F6F68] mt-0.5">Overview of your store performance</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatPrice(revenue), icon: TrendingUp },
          { label: 'Total Orders', value: String(orders.length), icon: ShoppingBag },
          { label: 'Avg Order Value', value: formatPrice(avgOrderValue), icon: TrendingUp },
          { label: 'Active Products', value: String(products.filter(p => p.status === 'active').length), icon: Package },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-[#E5E3DC] p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[#6F6F68] uppercase tracking-wide">{label}</p>
              <Icon className="h-4 w-4 text-[#315C45]" />
            </div>
            <p className="font-serif text-3xl text-[#171717]">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by status */}
        <div className="bg-white border border-[#E5E3DC] p-6">
          <h2 className="font-serif text-xl text-[#171717] mb-6">Orders by Status</h2>
          <div className="flex flex-col gap-4">
            {(['pending', 'processing', 'shipped', 'delivered'] as const).map((status) => {
              const count = statusCounts[status] ?? 0;
              const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="capitalize text-[#171717]">{status}</span>
                    <span className="text-[#6F6F68]">{count}</span>
                  </div>
                  <div className="h-2 bg-[#F7F6F1] overflow-hidden">
                    <div
                      className="h-full bg-[#315C45] transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Products by category */}
        <div className="bg-white border border-[#E5E3DC] p-6">
          <h2 className="font-serif text-xl text-[#171717] mb-6">Products by Category</h2>
          <div className="flex flex-col gap-4">
            {Object.entries(catCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[#171717]">{cat}</span>
                    <span className="text-[#6F6F68]">{count}</span>
                  </div>
                  <div className="h-2 bg-[#F7F6F1] overflow-hidden">
                    <div
                      className="h-full bg-[#171717] transition-all duration-700"
                      style={{ width: `${(count / maxCat) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
