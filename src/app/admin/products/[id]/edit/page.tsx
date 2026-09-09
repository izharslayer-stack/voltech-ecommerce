import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';

// Disable SSR — depends on localStorage-backed Zustand store
const EditProductClient = dynamic(() => import('./EditProductClient'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col gap-4 max-w-3xl">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-96 w-full" />
    </div>
  ),
});

export default function EditProductPage({ params }: { params: { id: string } }) {
  return <EditProductClient id={params.id} />;
}
