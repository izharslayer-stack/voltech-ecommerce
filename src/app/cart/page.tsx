'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Footer from '@/components/layout/Footer';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, shippingCost, total } = useCartStore();

  const sub = subtotal();
  const shipping = shippingCost();
  const tot = total();

  return (
    <>
      <div className="pt-28 pb-16 min-h-screen bg-[#F7F6F1]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h1
            className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#171717] mb-8 md:mb-12"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Your Cart
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-24">
              <ShoppingBag className="h-16 w-16 text-[#E5E3DC] mx-auto mb-4" />
              <p className="font-serif text-2xl text-[#171717] mb-2">Your cart is empty.</p>
              <p className="text-sm text-[#6F6F68] mb-8">Discover something you'll love.</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#171717] text-white text-sm px-7 py-3.5 hover:bg-[#315C45] transition-colors"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
              {/* Items */}
              <div className="lg:col-span-2 order-2 lg:order-1 flex flex-col divide-y divide-[#E5E3DC]">
                {items.map((item, i) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex gap-5 py-6"
                  >
                    <div className="h-24 w-24 md:h-28 md:w-28 flex-shrink-0 bg-white overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] tracking-widest text-[#6F6F68] uppercase">
                          {item.product.category}
                        </p>
                        <p className="text-sm md:text-base font-medium text-[#171717] mt-0.5">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-[#315C45] mt-0.5">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#E5E3DC] bg-white">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="h-8 w-8 flex items-center justify-center text-[#6F6F68] hover:text-[#171717] transition-colors"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="h-8 w-8 flex items-center justify-center text-[#6F6F68] hover:text-[#171717] transition-colors disabled:opacity-30"
                            aria-label="Increase"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-semibold text-[#171717]">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-[#6F6F68] hover:text-red-500 transition-colors"
                            aria-label="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1 order-1 lg:order-2">
                <div className="bg-white p-4 sm:p-6 lg:sticky lg:top-28">
                  <h2 className="font-serif text-xl text-[#171717] mb-6">Order Summary</h2>
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between text-[#6F6F68]">
                      <span>Subtotal</span>
                      <span>{formatPrice(sub)}</span>
                    </div>
                    <div className="flex justify-between text-[#6F6F68]">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-[#6F6F68]">
                        Free shipping on orders over $500
                      </p>
                    )}
                    <div className="flex justify-between font-semibold text-[#171717] text-base pt-3 border-t border-[#E5E3DC]">
                      <span>Total</span>
                      <span>{formatPrice(tot)}</span>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    className="mt-6 block w-full bg-[#171717] text-white text-sm text-center py-4 hover:bg-[#315C45] transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/shop"
                    className="mt-3 block w-full text-sm text-[#6F6F68] hover:text-[#171717] text-center transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
