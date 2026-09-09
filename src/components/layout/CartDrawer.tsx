'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeItem,
    subtotal,
    shippingCost,
    total,
  } = useCartStore();

  const sub = subtotal();
  const shipping = shippingCost();
  const tot = total();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-[110] w-full max-w-md bg-[#F7F6F1] flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E3DC]">
              <h2 className="font-serif text-lg text-[#171717]">
                Your Cart{' '}
                {items.length > 0 && (
                  <span className="text-[#6F6F68] text-sm font-sans">
                    ({items.length} {items.length === 1 ? 'item' : 'items'})
                  </span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="p-1.5 text-[#6F6F68] hover:text-[#171717] transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag className="h-12 w-12 text-[#E5E3DC]" />
                  <p className="font-serif text-lg text-[#171717]">Your cart is empty.</p>
                  <p className="text-sm text-[#6F6F68]">
                    Add something beautiful from the collection.
                  </p>
                  <button
                    onClick={closeCart}
                    className="text-sm text-[#315C45] border-b border-[#315C45] pb-0.5"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col divide-y divide-[#E5E3DC]">
                  {items.map((item) => (
                    <li key={item.product.id} className="py-5 flex gap-4">
                      {/* Image */}
                      <div className="h-20 w-20 flex-shrink-0 bg-[#E5E3DC] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] tracking-widest text-[#6F6F68] uppercase mb-0.5">
                          {item.product.category}
                        </p>
                        <p className="text-sm font-medium text-[#171717] leading-snug">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-[#315C45] mt-0.5">
                          {formatPrice(item.product.price)}
                        </p>

                        {/* Qty */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-[#E5E3DC] bg-white">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="h-7 w-7 flex items-center justify-center text-[#6F6F68] hover:text-[#171717] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.product.stock}
                              className="h-7 w-7 flex items-center justify-center text-[#6F6F68] hover:text-[#171717] transition-colors disabled:opacity-30"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-[#6F6F68] hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Line total */}
                      <p className="text-sm font-semibold text-[#171717] tabular-nums whitespace-nowrap">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#E5E3DC] px-6 py-6 bg-white">
                <div className="flex flex-col gap-2 mb-5">
                  <div className="flex justify-between text-sm text-[#6F6F68]">
                    <span>Subtotal</span>
                    <span>{formatPrice(sub)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#6F6F68]">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-[#171717] pt-2 border-t border-[#E5E3DC]">
                    <span>Total</span>
                    <span>{formatPrice(tot)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-[#171717] text-white text-sm text-center py-4 hover:bg-[#315C45] transition-colors duration-300"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="mt-3 w-full text-sm text-[#6F6F68] hover:text-[#171717] transition-colors text-center"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
