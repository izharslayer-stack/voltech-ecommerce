'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';
import { useProductsStore } from '@/store/productsStore';
import { formatPrice } from '@/lib/utils';

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const { products } = useProductsStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      document.body.style.overflow = '';
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeSearch]);

  const results = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          className="fixed inset-0 z-[150] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeSearch}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 bg-[#F7F6F1] mx-4 md:mx-auto md:w-full md:max-w-2xl mt-24 shadow-2xl"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E5E3DC]">
              <Search className="h-5 w-5 text-[#6F6F68] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="flex-1 bg-transparent text-[#171717] placeholder-[#6F6F68] text-base focus:outline-none"
                aria-label="Search"
              />
              <button
                onClick={closeSearch}
                className="p-1 text-[#6F6F68] hover:text-[#171717] transition-colors"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query && results.length === 0 && (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm text-[#6F6F68]">
                    No products found for &ldquo;{query}&rdquo;.
                  </p>
                </div>
              )}

              {results.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  onClick={closeSearch}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-white transition-colors group border-b border-[#E5E3DC] last:border-0"
                >
                  <div className="h-14 w-14 flex-shrink-0 bg-[#E5E3DC] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-widest text-[#6F6F68] uppercase mb-0.5">
                      {p.category}
                    </p>
                    <p className="text-sm text-[#171717] font-medium truncate">{p.name}</p>
                    <p className="text-sm text-[#315C45]">{formatPrice(p.price)}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#6F6F68] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}

              {!query && (
                <div className="px-5 py-8 text-center">
                  <p className="text-xs text-[#6F6F68] uppercase tracking-widest">
                    Start typing to search
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
