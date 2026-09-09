'use client';

import Link from 'next/link';
import { useProductsStore } from '@/store/productsStore';
import ProductForm from '@/components/admin/ProductForm';
import { Skeleton } from '@/components/ui/Skeleton';

export default function EditProductClient({ id }: { id: string }) {
  const { getProduct, initialized } = useProductsStore();

  if (!initialized) {
    return (
      <div className="flex flex-col gap-4 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const product = getProduct(id);

  if (!product) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-sm text-[#6F6F68]">Product not found.</p>
        <Link
          href="/admin/products"
          className="text-sm text-[#315C45] hover:underline"
        >
          ← Back to products
        </Link>
      </div>
    );
  }

  return <ProductForm mode="edit" product={product} />;
}
