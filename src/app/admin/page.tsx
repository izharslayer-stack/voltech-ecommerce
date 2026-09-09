'use client';

import { useProductsStore } from '@/store/productsStore';
import { useOrdersStore } from '@/store/ordersStore';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, Package, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import SalesChart from '@/components/admin/SalesChart';

function StatCard({
  label, value, icon: Icon, color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white border border-[#E5E3DC] p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-[#6F6F68] uppercase tracking-wide">{label}</p>
        <div className={`h-9 w-9 flex items-center justify-center ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <p className="font-serif text-3xl text-[#171717]">{value}</p>
    </div>
  );
}

const ORDER_STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
};

export default function AdminDashboard() {
  const { products } = useProductsStore();
  const { orders, totalRevenue } = useOrdersStore();

  const activeProducts = products.filter((p) => p.status === 'active').length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-[#171717]">Dashboard</h1>
        <p className="text-sm text-[#6F6F68] mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={formatPrice(totalRevenue())} icon={TrendingUp} color="bg-[#315C45]" />
        <StatCard label="Orders" value={String(orders.length)} icon={ShoppingBag} color="bg-[#171717]" />
        <StatCard label="Products" value={String(activeProducts)} icon={Package} color="bg-[#315C45]" />
        <StatCard label="Customers" value="1,248" icon={Users} color="bg-[#171717]" />
      </div>

      {/* Sales chart */}
      <SalesChart />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white border border-[#E5E3DC]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E3DC]">
            <h2 className="font-serif text-lg text-[#171717]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-[#315C45] hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-[#E5E3DC]">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-[#6F6F68] px-6 py-8 text-center">No orders yet.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#171717]">{order.id}</p>
                    <p className="text-xs text-[#6F6F68]">{order.customer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#171717]">{formatPrice(order.total)}</p>
                    <span className={`text-[10px] px-2 py-0.5 font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-[#E5E3DC]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E3DC]">
            <h2 className="font-serif text-lg text-[#171717]">Inventory Alerts</h2>
            {lowStock.length > 0 && (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            )}
          </div>
          <div className="divide-y divide-[#E5E3DC]">
            {lowStock.length === 0 ? (
              <p className="text-sm text-[#6F6F68] px-6 py-8 text-center">
                All products well stocked.
              </p>
            ) : (
              lowStock.map((p) => (
                <div key={p.id} className="px-6 py-4 flex items-center gap-3">
                  <div className="h-10 w-10 bg-[#F7F6F1] overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#171717] truncate">{p.name}</p>
                    <p className="text-[10px] text-amber-600">{p.stock} left</p>
                  </div>
                </div>
              ))
            )}
          </div>
          {lowStock.length > 0 && (
            <div className="px-6 py-4 border-t border-[#E5E3DC]">
              <Link
                href="/admin/products"
                className="text-xs text-[#315C45] hover:underline"
              >
                Manage Products →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white border border-[#E5E3DC]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E3DC]">
          <h2 className="font-serif text-lg text-[#171717]">Products</h2>
          <Link href="/admin/products" className="text-xs text-[#315C45] hover:underline">
            Manage
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E3DC]">
                {['Product', 'Category', 'Price', 'Stock', 'Status'].map((h) => (
                  <th key={h} className="text-left text-[10px] text-[#6F6F68] uppercase tracking-wide px-6 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DC]">
              {products.slice(0, 5).map((p) => (
                <tr key={p.id} className="hover:bg-[#F7F6F1] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-[#F7F6F1] overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-[#171717]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#6F6F68]">{p.category}</td>
                  <td className="px-6 py-4 text-[#171717]">{formatPrice(p.price)}</td>
                  <td className="px-6 py-4">
                    <span className={p.stock <= 5 ? 'text-amber-600 font-medium' : 'text-[#6F6F68]'}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2 py-1 font-medium ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
