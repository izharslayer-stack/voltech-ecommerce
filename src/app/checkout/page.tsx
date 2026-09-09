'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, CreditCard, Lock } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useOrdersStore } from '@/store/ordersStore';
import { useToastStore } from '@/store/toastStore';
import { formatPrice } from '@/lib/utils';
import Footer from '@/components/layout/Footer';
import type { CheckoutForm } from '@/types';

const INITIAL: CheckoutForm = {
  email: '', phone: '', fullName: '', address: '', city: '',
  state: '', postalCode: '', country: 'United States',
  cardNumber: '', cardExpiry: '', cardCVC: '', cardName: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingCost, total, clearCart } = useCartStore();
  const createOrder = useOrdersStore((s) => s.createOrder);
  const addToast = useToastStore((s) => s.addToast);

  const [form, setForm] = useState<CheckoutForm>(INITIAL);
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Redirect to cart if empty
  useEffect(() => {
    if (!success && items.length === 0) {
      router.replace('/cart');
    }
  }, [items.length, success, router]);

  const sub = subtotal();
  const shipping = shippingCost();
  const tot = total();

  function update(field: keyof CheckoutForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate() {
    const e: Partial<CheckoutForm> = {};
    if (!form.email) e.email = 'Required';
    if (!form.fullName) e.fullName = 'Required';
    if (!form.address) e.address = 'Required';
    if (!form.city) e.city = 'Required';
    if (!form.postalCode) e.postalCode = 'Required';
    if (!form.cardNumber) e.cardNumber = 'Required';
    if (!form.cardExpiry) e.cardExpiry = 'Required';
    if (!form.cardCVC) e.cardCVC = 'Required';
    if (!form.cardName) e.cardName = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    const order = createOrder({
      items,
      customer: { name: form.fullName, email: form.email, phone: form.phone },
      shipping: { address: form.address, city: form.city, state: form.state, postalCode: form.postalCode, country: form.country },
      subtotal: sub,
      shippingCost: shipping,
      total: tot,
    });

    clearCart();
    setOrderId(order.id);
    setSuccess(true);
    setLoading(false);
    addToast('Your order has been placed!');
  }

  const Field = ({
    label, field, type = 'text', placeholder, className = '',
  }: {
    label: string;
    field: keyof CheckoutForm;
    type?: string;
    placeholder?: string;
    className?: string;
  }) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-medium text-[#171717] uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        value={form[field]}
        onChange={(e) => update(field, e.target.value)}
        placeholder={placeholder}
        className={`bg-white border px-4 py-3 text-sm text-[#171717] placeholder-[#6F6F68] focus:outline-none transition-colors ${
          errors[field] ? 'border-red-400' : 'border-[#E5E3DC] focus:border-[#315C45]'
        }`}
      />
      {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
    </div>
  );

  if (success) {
    return (
      <div className="pt-24 sm:pt-28 min-h-screen bg-[#F7F6F1] flex items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="h-16 w-16 bg-[#DCE7DD] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-[#315C45]" />
          </div>
          <h1 className="font-serif text-3xl text-[#171717] mb-3">Order Confirmed</h1>
          <p className="text-sm text-[#6F6F68] mb-2">
            Thank you for your order, {form.fullName.split(' ')[0]}.
          </p>
          <p className="text-xs text-[#6F6F68] mb-8">
            Order ID: <span className="font-medium text-[#171717]">{orderId}</span>
          </p>
          <p className="text-sm text-[#6F6F68] mb-8">
            A confirmation will be sent to{' '}
            <span className="text-[#171717]">{form.email}</span>.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#171717] text-white text-sm px-7 py-3.5 hover:bg-[#315C45] transition-colors"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-24 sm:pt-28 pb-16 min-h-screen bg-[#F7F6F1]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#171717] mb-8 md:mb-12">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="lg:col-span-2 order-2 lg:order-1 flex flex-col gap-8">
              {/* Contact */}
              <section>
                <h2 className="text-xs font-semibold tracking-widest text-[#6F6F68] uppercase mb-4">Contact</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Email" field="email" type="email" placeholder="you@example.com" />
                  <Field label="Phone" field="phone" type="tel" placeholder="+1 555 000 0000" />
                </div>
              </section>

              {/* Shipping */}
              <section>
                <h2 className="text-xs font-semibold tracking-widest text-[#6F6F68] uppercase mb-4">Shipping</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" field="fullName" className="sm:col-span-2" />
                  <Field label="Address" field="address" className="sm:col-span-2" />
                  <Field label="City" field="city" />
                  <Field label="State / Province" field="state" />
                  <Field label="Postal Code" field="postalCode" />
                  <Field label="Country" field="country" />
                </div>
              </section>

              {/* Payment */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xs font-semibold tracking-widest text-[#6F6F68] uppercase">Payment</h2>
                  <div className="flex items-center gap-1 text-[10px] text-[#6F6F68]">
                    <Lock className="h-3 w-3" />
                    <span>Demo — no real payment</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Card Number" field="cardNumber" placeholder="4242 4242 4242 4242" className="sm:col-span-2" />
                  <Field label="Expiry (MM/YY)" field="cardExpiry" placeholder="12/27" />
                  <Field label="CVC" field="cardCVC" placeholder="123" />
                  <Field label="Name on Card" field="cardName" className="sm:col-span-2" />
                </div>
              </section>

              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-[#171717] text-white text-sm py-4 hover:bg-[#315C45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing…
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Place Order · {formatPrice(tot)}
                  </>
                )}
              </button>
            </form>

            {/* Order Summary */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="bg-white p-4 sm:p-6 lg:sticky lg:top-28">
                <h2 className="font-serif text-xl text-[#171717] mb-5">Summary</h2>
                <div className="flex flex-col gap-3 mb-5">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 items-start">
                      <div className="h-12 w-12 flex-shrink-0 bg-[#F7F6F1] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#171717] truncate">{item.product.name}</p>
                        <p className="text-xs text-[#6F6F68]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs font-medium text-[#171717]">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2 text-sm border-t border-[#E5E3DC] pt-4">
                  <div className="flex justify-between text-[#6F6F68]">
                    <span>Subtotal</span><span>{formatPrice(sub)}</span>
                  </div>
                  <div className="flex justify-between text-[#6F6F68]">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-[#171717] pt-2 border-t border-[#E5E3DC]">
                    <span>Total</span><span>{formatPrice(tot)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
