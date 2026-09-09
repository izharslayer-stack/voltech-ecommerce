'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const ThreeBackground = dynamic(() => import('@/components/three/ThreeBackground'), {
  ssr: false,
  loading: () => null,
});

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80';

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F7F6F1]">
      {/* Three.js background */}
      <ThreeBackground className="absolute inset-0 pointer-events-none" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#171717 1px, transparent 1px), linear-gradient(90deg, #171717 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Full-width grid — left text col + right image col */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 min-h-screen">

        {/* ── Left column — copy ── */}
        <div className="flex flex-col justify-center gap-8 px-6 sm:px-10 lg:px-16 xl:px-24 pt-28 pb-16 md:pt-0 md:pb-0">

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="h-px w-8 bg-[#315C45]" />
            <span className="text-xs tracking-widest text-[#315C45] font-medium uppercase">
              Premium Electronics
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#171717] leading-[1.05] tracking-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Technology,
            <br />
            <em className="not-italic text-[#315C45]">Elevated.</em>
          </motion.h1>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base md:text-lg text-[#6F6F68] leading-relaxed max-w-md"
          >
            Premium consumer electronics, thoughtfully curated for people who
            care about quality, design, and performance.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 bg-[#171717] text-white text-sm px-7 py-3.5 hover:bg-[#315C45] transition-colors duration-300"
            >
              Shop Now
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-[#171717] border-b border-[#171717] pb-0.5 hover:text-[#315C45] hover:border-[#315C45] transition-colors duration-200"
            >
              Explore Collection
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex flex-wrap gap-6 sm:gap-8 pt-4 border-t border-[#E5E3DC]"
          >
            {[
              { value: '500+', label: 'Products' },
              { value: '50K+', label: 'Customers' },
              { value: '4.9★', label: 'Avg. Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-2xl text-[#171717]">{stat.value}</p>
                <p className="text-xs text-[#6F6F68] mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right column — image fills edge to edge ── */}
        <motion.div
          initial={{ opacity: 0, scale: 1.03, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:block relative"
        >
          {/* image stretches the full column height + width */}
          <div className="absolute inset-0 overflow-hidden bg-[#E5E3DC]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMAGE}
              alt="Sony WH-1000XM5 headphones"
              className="w-full h-full object-cover"
            />

          </div>

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-sm px-4 py-3 shadow-lg"
          >
            <p className="text-xs text-[#6F6F68] uppercase tracking-wide mb-0.5">
              Best Seller
            </p>
            <p className="text-sm font-medium text-[#171717]">Sony WH-1000XM5</p>
            <p className="text-base font-serif text-[#315C45]">$349</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/4 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-[#6F6F68]"
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </motion.div>
    </section>
  );
}
