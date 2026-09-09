'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function EditorialBanner() {
  return (
    <section className="bg-[#171717] py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — quote */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-8"
          >
            <div className="h-px w-12 bg-[#315C45]" />
            <blockquote
              className="font-serif text-3xl md:text-4xl text-white leading-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              &ldquo;The right tool, chosen carefully,
              <br />
              <em className="not-italic text-[#DCE7DD]">
                changes everything.
              </em>
              &rdquo;
            </blockquote>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Every product in our collection is hand-tested and selected because
              we genuinely believe it's worth owning — not because it's the most
              popular or the most profitable.
            </p>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-sm text-white border-b border-neutral-600 pb-0.5 hover:border-white transition-colors w-fit"
            >
              Our Philosophy
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Right — editorial image stack */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative hidden lg:block"
          >
            {/* Primary */}
            <div className="aspect-[4/3] overflow-hidden ml-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=700&q=80"
                alt="Tech workspace"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Secondary — offset card */}
            <div className="absolute -bottom-6 -left-0 w-48 h-48 overflow-hidden border-4 border-[#171717]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80"
                alt="Wearable tech"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Accent square */}
            <div className="absolute -top-4 left-4 w-24 h-24 bg-[#315C45]/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
