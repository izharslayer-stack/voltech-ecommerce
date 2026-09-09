'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    count: '24 products',
  },
  {
    name: 'Laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
    count: '18 products',
  },
  {
    name: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80',
    count: '32 products',
  },
  {
    name: 'Cameras',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80',
    count: '12 products',
  },
];

export default function CategorySection() {
  return (
    <section className="py-16 md:py-24 bg-[#F7F6F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-[#315C45]" />
              <span className="text-xs tracking-widest text-[#315C45] font-medium uppercase">
                Categories
              </span>
            </div>
            <h2
              className="font-serif text-4xl text-[#171717]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Shop by category
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-1.5 text-sm text-[#6F6F68] hover:text-[#171717] transition-colors group"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group block relative overflow-hidden bg-white aspect-square"
              >
                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <p className="text-white font-serif text-base md:text-xl leading-tight">
                    {cat.name}
                  </p>
                  <p className="text-white/60 text-xs mt-0.5">{cat.count}</p>
                </div>
                {/* Arrow */}
                <div className="absolute top-4 right-4 h-8 w-8 bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-all duration-300">
                  <ArrowRight className="h-4 w-4 text-white group-hover:text-[#171717] transition-colors duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
