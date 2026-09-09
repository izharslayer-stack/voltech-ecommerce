import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-none bg-gradient-to-r from-[#E5E3DC] via-[#F0EFE9] to-[#E5E3DC] bg-[length:400%_100%]',
        className
      )}
      style={{
        animation: 'shimmer 1.8s ease-in-out infinite',
      }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <Skeleton className="aspect-square w-full" />
      <div className="flex flex-col gap-4 pt-8">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-[#E5E3DC] p-6 flex flex-col gap-3">
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-8 w-3/4" />
    </div>
  );
}
