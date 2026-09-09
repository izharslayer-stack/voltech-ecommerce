'use client';

import { useState } from 'react';
import { useOrdersStore } from '@/store/ordersStore';
import { formatPrice } from '@/lib/utils';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
};

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrdersStore();
  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl text-[#171717]">Orders</h1>
        <p className="text-sm text-[#6F6F68] mt-0.5">{orders.length} total orders</p>
      </div>

      <div className="bg-white border border-[#E5E3DC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E3DC] bg-[#F7F6F1]">
                {['Order ID', 'Customer', 'Total', 'Status', 'Date', 'Update Status'].map((h) => (
                  <th key={h} className="text-left text-[10px] text-[#6F6F68] uppercase tracking-wide px-5 py-3 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DC]">
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-sm text-[#6F6F68] py-12">
                    No orders yet.
                  </td>
                </tr>
              )}
              {sorted.map((order) => (
                <tr key={order.id} className="hover:bg-[#F7F6F1] transition-colors">
                  <td className="px-5 py-4 font-medium text-[#171717]">{order.id}</td>
                  <td className="px-5 py-4">
                    <p className="text-[#171717]">{order.customer.name}</p>
                    <p className="text-[10px] text-[#6F6F68]">{order.customer.email}</p>
                  </td>
                  <td className="px-5 py-4 font-semibold text-[#171717]">{formatPrice(order.total)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] px-2 py-1 font-medium ${STATUS_COLORS[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#6F6F68] whitespace-nowrap text-xs">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value as any)
                      }
                      className="bg-white border border-[#E5E3DC] px-3 py-1.5 text-xs text-[#171717] focus:outline-none focus:border-[#315C45] appearance-none cursor-pointer"
                      aria-label={`Update status for ${order.id}`}
                    >
                      {['pending', 'processing', 'shipped', 'delivered'].map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
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
