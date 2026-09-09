'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  objectFit?: 'cover' | 'contain';
  priority?: boolean;
}

export default function ProductImage({
  src,
  alt,
  className,
  objectFit = 'cover',
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={cn('relative overflow-hidden bg-[#F7F6F1]', className)}>
      {/* Shimmer while loading */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#E5E3DC] via-[#F0EFE9] to-[#E5E3DC]" />
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#6F6F68]">
          <Package className="h-8 w-8 opacity-40" />
          <span className="text-xs opacity-60">Image unavailable</span>
        </div>
      )}

      {/* Actual image */}
      {!error && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            'w-full h-full transition-opacity duration-500',
            objectFit === 'cover' ? 'object-cover' : 'object-contain',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  );
}
