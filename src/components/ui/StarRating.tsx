import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  className?: string;
  size?: 'sm' | 'md';
}

export default function StarRating({ rating, className, size = 'sm' }: StarRatingProps) {
  const filled = Math.floor(rating);
  const partial = rating % 1;
  const stars = 5;
  const iconSize = size === 'sm' ? 12 : 16;

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: stars }).map((_, i) => {
        const fill = i < filled ? 1 : i === filled ? partial : 0;
        return (
          <span
            key={i}
            className="relative inline-block"
            style={{ width: iconSize, height: iconSize }}
          >
            {/* empty */}
            <Star
              size={iconSize}
              className="text-[#E5E3DC] fill-[#E5E3DC] absolute inset-0"
            />
            {/* filled overlay */}
            {fill > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star size={iconSize} className="text-[#315C45] fill-[#315C45]" />
              </span>
            )}
          </span>
        );
      })}
      <span className="ml-1 text-xs text-[#6F6F68] tabular-nums">{rating.toFixed(1)}</span>
    </div>
  );
}
