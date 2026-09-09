import type { Metadata } from 'next';
import ProductGrid from '@/components/sections/ProductGrid';
import Footer from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse our complete collection of premium electronics.',
};

export default function ShopPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-[#F7F6F1] pt-28 pb-12 border-b border-[#E5E3DC]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs tracking-widest text-[#315C45] uppercase mb-3">Collection</p>
          <h1
            className="font-serif text-5xl md:text-6xl text-[#171717]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            All Products
          </h1>
        </div>
      </div>
      <ProductGrid showFilters={true} heading="" />
      <Footer />
    </>
  );
}
