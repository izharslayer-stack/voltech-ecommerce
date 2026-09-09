'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { formatPrice, getDiscountPercent } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import StarRating from '@/components/ui/StarRating';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [wished, setWished] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    addToast(`${product.name} added to cart`);
  }

  const discount =
    product.originalPrice
      ? getDiscountPercent(product.price, product.originalPrice)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        {/* Image container */}
        <div className="relative overflow-hidden bg-[#F7F6F1] aspect-[4/5] mb-4">
          {/* Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-[#315C45] text-white text-[10px] font-semibold px-2 py-0.5 tracking-wide">
              -{discount}%
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-3 left-3 z-10 bg-[#171717] text-white text-[10px] font-semibold px-2 py-0.5 tracking-wide">
              SOLD OUT
            </div>
          )}

          {/* Wish button — always visible on touch, hover-only on desktop */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setWished((w) => !w);
            }}
            className="absolute top-3 right-3 z-10 h-8 w-8 flex items-center justify-center bg-white/80 backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`h-3.5 w-3.5 transition-colors duration-200 ${wished ? 'fill-red-500 text-red-500' : 'text-[#6F6F68]'}`}
            />
          </button>

          {/* Product image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Add to cart — always visible on mobile, slide-up on desktop */}
          <div
            onClick={handleAddToCart}
            className="absolute bottom-0 left-0 right-0 bg-[#171717] text-white text-sm py-3 flex items-center justify-center gap-2 cursor-pointer
              translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{product.stock === 0 ? 'Sold Out' : 'Add to Cart'}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] tracking-widest text-[#6F6F68] uppercase">
            {product.category}
          </p>
          <h3 className="text-sm font-medium text-[#171717] leading-snug group-hover:text-[#315C45] transition-colors duration-200">
            {product.name}
          </h3>
          {product.rating && <StarRating rating={product.rating} />}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm font-semibold text-[#171717]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#6F6F68] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
