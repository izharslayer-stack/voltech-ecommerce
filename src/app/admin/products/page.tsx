'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProductsStore } from '@/store/productsStore';
import { useToastStore } from '@/store/toastStore';
import { formatPrice } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function AdminProductsPage() {
  const { products, deleteProduct } = useProductsStore();
  const addToast = useToastStore((s) => s.addToast);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = products.filter((p) =>
    [p.name, p.category, p.sku ?? ''].some((f) =>
      f.toLowerCase().includes(search.toLowerCase())
    )
  );

  function confirmDelete(id: string) {
    setDeleteId(id);
  }

  function handleDelete() {
    if (!deleteId) return;
    const name = products.find((p) => p.id === deleteId)?.name ?? 'Product';
    deleteProduct(deleteId);
    addToast(`${name} deleted`, 'success');
    setDeleteId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl text-[#171717]">Products</h1>
          <p className="text-sm text-[#6F6F68] mt-0.5">{products.length} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#171717] text-white text-sm px-5 py-2.5 hover:bg-[#315C45] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white border border-[#E5E3DC] px-4 py-2.5 max-w-sm">
        <Search className="h-4 w-4 text-[#6F6F68]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="bg-transparent text-sm text-[#171717] placeholder-[#6F6F68] focus:outline-none flex-1"
          aria-label="Search products"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E5E3DC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E3DC] bg-[#F7F6F1]">
                {['', 'Product', 'Category', 'Price', 'Stock', 'Featured', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-[10px] text-[#6F6F68] uppercase tracking-wide px-4 py-3 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DC]">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-sm text-[#6F6F68] py-12">
                    No products found.
                  </td>
                </tr>
              )}
              {filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-[#F7F6F1] transition-colors"
                >
                  {/* Image */}
                  <td className="px-4 py-3">
                    <div className="h-10 w-10 bg-[#F7F6F1] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  {/* Name */}
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#171717] whitespace-nowrap">{p.name}</p>
                    {p.sku && <p className="text-[10px] text-[#6F6F68]">{p.sku}</p>}
                  </td>
                  <td className="px-4 py-3 text-[#6F6F68] whitespace-nowrap">{p.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[#171717] font-medium">{formatPrice(p.price)}</span>
                    {p.originalPrice && (
                      <span className="ml-2 text-xs text-[#6F6F68] line-through">
                        {formatPrice(p.originalPrice)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={p.stock <= 5 ? 'text-amber-600 font-medium' : 'text-[#6F6F68]'}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.featured ? (
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ) : (
                      <span className="text-[#E5E3DC]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-1 font-medium ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="h-7 w-7 flex items-center justify-center text-[#6F6F68] hover:text-[#171717] transition-colors"
                        aria-label={`Edit ${p.name}`}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => confirmDelete(p.id)}
                        className="h-7 w-7 flex items-center justify-center text-[#6F6F68] hover:text-red-500 transition-colors"
                        aria-label={`Delete ${p.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Product"
        maxWidth="sm"
      >
        <p className="text-sm text-[#6F6F68] mb-6">
          Are you sure you want to delete{' '}
          <strong className="text-[#171717]">
            {products.find((p) => p.id === deleteId)?.name}
          </strong>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
