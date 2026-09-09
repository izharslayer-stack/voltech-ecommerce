'use client';

import Link from 'next/link';
import { Zap, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  return (
    <footer className="bg-[#171717] text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 bg-[#315C45] flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-serif text-xl tracking-tight">Voltech</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-[200px]">
              Premium electronics, thoughtfully selected for modern life.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-4">
              Shop
            </h3>
            <ul className="flex flex-col gap-2.5">
              {['All Products', 'Headphones', 'Laptops', 'Smartphones', 'Best Sellers', 'New Arrivals'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="/shop"
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-4">
              Company
            </h3>
            <ul className="flex flex-col gap-2.5">
              {['About', 'Journal', 'Contact', 'Careers', 'Press'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Journal' ? '/journal' : '/about'}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-4">
              Support
            </h3>
            <ul className="flex flex-col gap-2.5">
              {['Shipping', 'Returns', 'Warranty', 'FAQ', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link
                    href="/about"
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-neutral-800 pt-12 pb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm text-neutral-300 font-medium mb-1">
                Stay in the loop.
              </p>
              <p className="text-sm text-neutral-500">
                Occasional notes on new tech, exclusive deals, and behind-the-scenes.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} Voltech. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
              <button
                key={i}
                className="text-neutral-600 hover:text-white transition-colors"
                aria-label="Social media"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
