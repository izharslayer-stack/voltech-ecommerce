'use client';

import { useOrdersStore } from '@/store/ordersStore';
import { formatPrice } from '@/lib/utils';

export default function AdminCustomersPage() {
  const { orders } = useOrdersStore();

  // Derive unique customers from orders
  const customerMap = new Map<string, { name: string; email: string; orders: number; spent: number }>();
  orders.forEach((o) => {
    const key = o.customer.email;
    if (customerMap.has(key)) {
      const c = customerMap.get(key)!;
      c.orders += 1;
      c.spent += o.total;
    } else {
      customerMap.set(key, { name: o.customer.name, email: o.customer.email, orders: 1, spent: o.total });
    }
  });
  const customers = Array.from(customerMap.values()).sort((a, b) => b.spent - a.spent);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl text-[#171717]">Customers</h1>
        <p className="text-sm text-[#6F6F68] mt-0.5">{customers.length} unique customers</p>
      </div>

      <div className="bg-white border border-[#E5E3DC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E3DC] bg-[#F7F6F1]">
                {['Customer', 'Email', 'Orders', 'Total Spent'].map((h) => (
                  <th key={h} className="text-left text-[10px] text-[#6F6F68] uppercase tracking-wide px-5 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DC]">
              {customers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-sm text-[#6F6F68] py-12">
                    No customers yet.
                  </td>
                </tr>
              )}
              {customers.map((c) => (
                <tr key={c.email} className="hover:bg-[#F7F6F1] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-[#DCE7DD] flex items-center justify-center text-xs font-bold text-[#315C45]">
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-medium text-[#171717]">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#6F6F68]">{c.email}</td>
                  <td className="px-5 py-4 text-[#171717]">{c.orders}</td>
                  <td className="px-5 py-4 font-semibold text-[#171717]">{formatPrice(c.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
