'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useProductsStore } from '@/store/productsStore';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { formatPrice } from '@/lib/utils';
import StarRating from '@/components/ui/StarRating';
import Link from 'next/link';

export default function FeaturedProduct() {
  const featured = useProductsStore((s) => s.getFeaturedProducts());
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);

  const product = featured[0];
  if (!product) return null;

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-10 md:mb-16"
        >
          <span className="h-px w-8 bg-[#315C45]" />
          <span className="text-xs tracking-widest text-[#315C45] font-medium uppercase">
            Featured
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -top-8 -left-8 w-48 h-48 bg-[#F7F6F1] -z-10" />
            <div className="aspect-square overflow-hidden bg-[#F7F6F1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            <div>
              <p className="text-xs tracking-widest text-[#6F6F68] uppercase mb-2">
                {product.category}
              </p>
              <h2
                className="font-serif text-4xl md:text-5xl text-[#171717] leading-tight mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Meet your next favourite device.
              </h2>
              <h3 className="font-serif text-2xl text-[#315C45]">{product.name}</h3>
            </div>

            {product.rating && (
              <StarRating rating={product.rating} size="md" />
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl text-[#171717]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-[#6F6F68] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-[#6F6F68] leading-relaxed max-w-md">{product.description}</p>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => {
                  addItem(product);
                  addToast(`${product.name} added to cart`);
                }}
                className="group inline-flex items-center gap-2 bg-[#171717] text-white text-sm px-7 py-3.5 hover:bg-[#315C45] transition-colors duration-300"
              >
                Add to Cart
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <Link
                href={`/products/${product.slug}`}
                className="inline-flex items-center gap-2 text-sm text-[#171717] border-b border-[#171717] pb-0.5 hover:text-[#315C45] hover:border-[#315C45] transition-colors duration-200"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
