'use client';

import { motion } from 'framer-motion';
import { Truck, RotateCcw, Shield, Headphones } from 'lucide-react';

const PERKS = [
  { icon: Truck,        title: 'Free Shipping',    body: 'On orders over $500' },
  { icon: RotateCcw,   title: '30-Day Returns',   body: 'No questions asked' },
  { icon: Shield,      title: '2-Year Warranty',  body: 'On all products' },
  { icon: Headphones,  title: 'Expert Support',   body: 'Mon–Fri, 9am–6pm' },
];

export default function BrandStrip() {
  return (
    <section className="bg-white border-y border-[#E5E3DC] py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {PERKS.map((perk, i) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-start gap-3"
            >
              <div className="h-9 w-9 flex-shrink-0 bg-[#DCE7DD] flex items-center justify-center mt-0.5">
                <perk.icon className="h-4 w-4 text-[#315C45]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#171717]">{perk.title}</p>
                <p className="text-xs text-[#6F6F68] mt-0.5">{perk.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
