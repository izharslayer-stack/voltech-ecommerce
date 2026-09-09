import dynamic from 'next/dynamic';
import { ProductDetailSkeleton } from '@/components/ui/Skeleton';

// Disable SSR — this page reads localStorage via Zustand
const ProductPageClient = dynamic(() => import('./ProductPageClient'), {
  ssr: false,
  loading: () => (
    <div className="pt-28 min-h-screen bg-[#F7F6F1]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <ProductDetailSkeleton />
      </div>
    </div>
  ),
});

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductPageClient slug={params.slug} />;
}
