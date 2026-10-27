import { formatToman } from '../../lib/format.js';
import { Star } from 'lucide-react';

export function Price({ price, compareAtPrice, className = '', tone = 'default' }) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  return (
    <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${className}`}>
      {hasDiscount ? (
        <span className="num text-xs text-muted line-through">{formatToman(compareAtPrice)}</span>
      ) : null}
      <span
        className={`num text-sm font-semibold ${tone === 'light' ? 'text-white' : 'text-ink'}`}
      >
        {formatToman(price)}
      </span>
      <span className={`text-[11px] ${tone === 'light' ? 'text-white/70' : 'text-muted'}`}>
        تومان
      </span>
    </div>
  );
}

/** Renders only when the product actually has review data. */
export function Rating({ rating, className = '' }) {
  if (!rating || !rating.count) return null;
  return (
    <div className={`flex items-center gap-1.5 text-[11px] text-muted ${className}`}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={11}
            className={
              index < Math.round(rating.average) ? 'fill-ink text-ink' : 'text-beige'
            }
          />
        ))}
      </span>
      <span className="num">({formatToman(rating.count)})</span>
      <span className="sr-only">
        امتیاز {rating.average} از ۵ بر اساس {rating.count} نظر
      </span>
    </div>
  );
}
