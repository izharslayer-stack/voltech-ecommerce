'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Zap, Shield, Truck, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useProductsStore } from '@/store/productsStore';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { formatPrice } from '@/lib/utils';
import StarRating from '@/components/ui/StarRating';
import ProductGrid from '@/components/sections/ProductGrid';
import Footer from '@/components/layout/Footer';

export default function ProductPageClient({ slug }: { slug: string }) {
  const { getProduct, initialized } = useProductsStore();
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);

  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const product = initialized ? getProduct(slug) : undefined;

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F7F6F1] flex flex-col items-center justify-center text-center px-6">
        <p className="text-xs tracking-widest text-[#315C45] uppercase mb-4">404</p>
        <h1
          className="font-serif text-4xl text-[#171717] mb-4"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Product not found.
        </h1>
        <p className="text-sm text-[#6F6F68] mb-8">
          This product may no longer be available.
        </p>
        <Link
          href="/shop"
          className="bg-[#171717] text-white text-sm px-7 py-3.5 hover:bg-[#315C45] transition-colors"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.image];

  function handleAddToCart() {
    addItem(product!, qty);
    addToast(`${product!.name} added to cart`);
  }

  return (
    <>
      <div className="pt-16 md:pt-20 bg-[#F7F6F1] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-xs text-[#6F6F68] mb-10"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-[#171717] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#171717] transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-[#171717]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4"
            >
              <div className="aspect-square overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 flex-wrap">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`h-20 w-20 overflow-hidden border-2 transition-colors duration-200 ${
                        activeImage === i ? 'border-[#315C45]' : 'border-transparent hover:border-[#E5E3DC]'
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col gap-6 pt-2"
            >
              <div>
                <p className="text-xs tracking-widest text-[#315C45] uppercase mb-2">
                  {product.category}
                </p>
                <h1
                  className="font-serif text-3xl md:text-4xl text-[#171717] leading-tight mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {product.name}
                </h1>
                {product.rating && <StarRating rating={product.rating} size="md" />}
              </div>

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

              <p className="text-[#6F6F68] leading-relaxed">{product.description}</p>

              {/* Stock indicator */}
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    product.stock > 0 ? 'bg-[#315C45]' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm text-[#6F6F68]">
                  {product.stock > 0
                    ? product.stock < 5
                      ? `Only ${product.stock} left`
                      : 'In stock'
                    : 'Currently unavailable'}
                </span>
              </div>

              {product.sku && (
                <p className="text-xs text-[#6F6F68]">SKU: {product.sku}</p>
              )}

              {/* Quantity */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#171717]">Quantity</span>
                  <div className="flex items-center border border-[#E5E3DC] bg-white">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="h-10 w-10 flex items-center justify-center text-[#6F6F68] hover:text-[#171717] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm tabular-nums">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      className="h-10 w-10 flex items-center justify-center text-[#6F6F68] hover:text-[#171717] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#171717] text-white text-sm py-4 hover:bg-[#315C45] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {product.stock === 0 ? 'Currently Unavailable' : 'Add to Cart'}
                </button>
                <Link
                  href="/checkout"
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#315C45] text-white text-sm py-4 hover:bg-[#274d38] transition-colors duration-300"
                >
                  <Zap className="h-4 w-4" />
                  Buy Now
                </Link>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E5E3DC]">
                {[
                  { icon: Truck,      label: 'Free Shipping',  sub: 'Orders over $500' },
                  { icon: RotateCcw,  label: '30-Day Returns', sub: 'Hassle-free' },
                  { icon: Shield,     label: '2-Year Warranty',sub: 'Manufacturer backed' },
                  { icon: Zap,        label: 'Fast Dispatch',  sub: 'Same-day before 2 pm' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <Icon className="h-4 w-4 text-[#315C45] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-[#171717]">{label}</p>
                      <p className="text-[10px] text-[#6F6F68]">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Long description */}
          {product.longDescription && (
            <div className="mt-20 max-w-3xl">
              <h2 className="font-serif text-2xl text-[#171717] mb-6">
                Product Details
              </h2>
              <p className="text-sm text-[#6F6F68] leading-relaxed whitespace-pre-line">
                {product.longDescription}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      <ProductGrid
        fixedCategory={product.category}
        showFilters={false}
        heading={`More ${product.category}`}
        limit={4}
      />
      <Footer />
    </>
  );
}
