import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useFavouriteStore } from '../store/favouriteStore';

const ProductCard = ({ product }) => {
  const logClick  = useAnalyticsStore((s) => s.logClick);
  const { toggle, isFavourite } = useFavouriteStore();

  const title     = product.product_title || product.title;
  const image     = product.product_main_image_url || product.image;
  const price     = product.target_sale_price || product.price;
  const origPrice = product.original_price;
  const rating    = product.evaluate_rate || product.rating || '4.8';
  const merchant  = product.merchant || 'AliExpress';
  const buyLink   = product.promotion_link || (product.slug ? `/go/${product.slug}` : '#');
  const pid       = product.product_id || product.id;
  const fav       = isFavourite(product);

  const discount = useMemo(() => {
    if (!origPrice || !price) return 0;
    const orig = parseFloat(origPrice), cur = parseFloat(price);
    return orig > cur ? Math.round(((orig - cur) / orig) * 100) : 0;
  }, [origPrice, price]);

  const handleBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.promotion_link) {
      logClick(pid, merchant);
      window.open(buyLink, '_blank', 'noopener,noreferrer');
    }
  };

  const jsonLd = {
    '@context': 'https://schema.org/', '@type': 'Product', name: title, image,
    brand: { '@type': 'Brand', name: merchant },
    offers: { '@type': 'Offer', url: `${window.location.origin}/product/${pid}`, priceCurrency: 'USD', price, availability: 'https://schema.org/InStock' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: rating, reviewCount: '85' },
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <div className="group bg-white border border-gray-100 rounded-lg overflow-hidden flex flex-col hover:shadow-lg hover:border-amber-300 transition-all duration-200 h-full">

        {/* Image area */}
        <Link to={`/product/${pid}`} className="relative block overflow-hidden bg-gray-50 aspect-square shrink-0">
          <img
            src={image} alt={title} loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />

          {/* Discount badge — top left */}
          {discount > 0 && (
            <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none z-10">
              -{discount}%
            </span>
          )}

          {/* Favourite — top right */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product); }}
            className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center shadow transition-all duration-200 z-10 ${
              fav ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-rose-500'
            }`}
            aria-label={fav ? 'Remove from saved' : 'Save'}
          >
            <Heart size={12} className={fav ? 'fill-white' : ''} />
          </button>

          {/* Cart button — bottom right, appears on hover */}
          <button
            onClick={handleBuy}
            className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 hover:bg-amber-500 hover:text-white transition-all duration-200 z-10 text-gray-600"
            aria-label="Buy now"
          >
            <ShoppingCart size={14} />
          </button>
        </Link>

        {/* Info */}
        <div className="p-2 flex flex-col gap-1 flex-1">

          {/* Title */}
          <Link to={`/product/${pid}`}>
            <p className="text-[11px] sm:text-[12px] text-gray-700 leading-tight line-clamp-2 h-[2.5em] overflow-hidden hover:text-amber-700 transition-colors">
              {title}
            </p>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-0.5 mt-auto">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={9}
                className={parseFloat(rating) >= i ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
              />
            ))}
            <span className="text-[10px] text-gray-400 ml-1">{rating}</span>
          </div>

          {/* Price row */}
          <div className="flex items-end justify-between gap-1 mt-0.5">
            <div>
              <p className="text-sm sm:text-[15px] font-bold text-gray-900 leading-none">
                ${parseFloat(price || 0).toFixed(2)}
              </p>
              {origPrice && (
                <p className="text-[10px] text-gray-400 line-through leading-none mt-0.5">
                  ${parseFloat(origPrice).toFixed(2)}
                </p>
              )}
            </div>

            {/* Buy button — always visible on mobile, hover on desktop */}
            <a
              href={buyLink} target="_blank" rel="nofollow noopener"
              onClick={() => { if (product.promotion_link) logClick(pid, merchant); }}
              className="shrink-0 sm:opacity-0 sm:group-hover:opacity-100 flex items-center justify-center w-7 h-7 bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-all duration-200"
              aria-label="Buy"
            >
              <ShoppingCart size={13} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
