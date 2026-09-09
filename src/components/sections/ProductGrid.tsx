'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useProductsStore } from '@/store/productsStore';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { SortOption } from '@/types';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

interface ProductGridProps {
  /** When provided, only this category shows (no filter tabs). */
  fixedCategory?: string;
  showFilters?: boolean;
  heading?: string;
  limit?: number;
  loading?: boolean;
}

export default function ProductGrid({
  fixedCategory,
  showFilters = true,
  heading = 'Shop the collection',
  limit,
  loading = false,
}: ProductGridProps) {
  const { products, getCategories } = useProductsStore();
  const categories = getCategories();

  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState<SortOption>('featured');

  const filtered = useMemo(() => {
    const cat = fixedCategory ?? activeCategory;
    let list = products.filter((p) => p.status === 'active');
    if (cat && cat !== 'All') {
      list = list.filter((p) => p.category === cat);
    }

    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list = [...list].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'featured':
      default:
        list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return limit ? list.slice(0, limit) : list;
  }, [products, fixedCategory, activeCategory, sort, limit]);

  return (
    <section className="py-16 md:py-24 bg-[#F7F6F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-[#315C45]" />
              <span className="text-xs tracking-widest text-[#315C45] font-medium uppercase">
                Collection
              </span>
            </div>
            <h2
              className="font-serif text-4xl text-[#171717]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {heading}
            </h2>
          </motion.div>

          {/* Sort */}
          {showFilters && (
            <div className="relative w-full md:w-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="w-full md:w-auto appearance-none bg-white border border-[#E5E3DC] text-sm text-[#171717] pl-4 pr-10 py-2.5 focus:outline-none focus:border-[#315C45] cursor-pointer"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6F6F68] pointer-events-none" />
            </div>
          )}
        </div>

        {/* Category tabs */}
        {showFilters && !fixedCategory && (
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-4 py-2 border transition-colors duration-200 ${
                  activeCategory === cat
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-transparent text-[#6F6F68] border-[#E5E3DC] hover:border-[#171717] hover:text-[#171717]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-[#171717] mb-2">
              Your collection is waiting to grow.
            </p>
            <p className="text-sm text-[#6F6F68]">
              No products found in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
