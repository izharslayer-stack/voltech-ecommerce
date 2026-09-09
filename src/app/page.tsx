import type { Metadata } from 'next';
import Hero from '@/components/sections/Hero';
import BrandStrip from '@/components/sections/BrandStrip';
import FeaturedProduct from '@/components/sections/FeaturedProduct';
import CategorySection from '@/components/sections/CategorySection';
import ProductGrid from '@/components/sections/ProductGrid';
import EditorialBanner from '@/components/sections/EditorialBanner';
import Footer from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Voltech — Premium Electronics',
  description:
    'Premium consumer electronics, thoughtfully curated for modern life.',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandStrip />
      <FeaturedProduct />
      <CategorySection />
      <ProductGrid heading="Shop the collection" showFilters={true} />
      <EditorialBanner />
      <Footer />
    </>
  );
}
