import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Star, Heart } from 'lucide-react';
import { Button } from './ui/Button';
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
  const merchant  = product.second_level_category_name || product.merchant || 'Partner';
  const buyLink   = product.promotion_link || (product.slug ? `/go/${product.slug}` : '#');
  const pid       = product.product_id || product.id;
  const fav       = isFavourite(product);

  const discount = useMemo(() => {
    if (!origPrice || !price) return 0;
    const orig = parseFloat(origPrice), cur = parseFloat(price);
    return orig > cur ? Math.round(((orig - cur) / orig) * 100) : 0;
  }, [origPrice, price]);

  const handleBuy = () => { if (product.promotion_link) logClick(pid, merchant); };

  const jsonLd = {
    '@context': 'https://schema.org/', '@type': 'Product', name: title, image,
    brand: { '@type': 'Brand', name: merchant },
    offers: { '@type': 'Offer', url: `${window.location.origin}/product/${pid}`, priceCurrency: 'USD', price, availability: 'https://schema.org/InStock' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: rating, reviewCount: '85' },
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:shadow-lg hover:border-amber-400 transition-all duration-200">

        {/* Image */}
        <Link to={`/product/${pid}`} className="relative block aspect-square overflow-hidden bg-gray-50">
          <img src={image} alt={title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

          {/* Discount badge — top right */}
          {discount > 0 && (
            <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md">
              -{discount}%
            </span>
          )}

          {/* Heart button — top left */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product); }}
            className={`absolute top-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
              fav
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 text-gray-400 hover:text-rose-500 hover:bg-white'
            }`}
            aria-label={fav ? 'Remove from saved' : 'Save product'}
          >
            <Heart size={15} className={fav ? 'fill-white' : ''} />
          </button>
        </Link>

        {/* Info */}
        <div className="p-4 flex flex-col flex-grow gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-amber-700 font-semibold uppercase tracking-wide truncate">{merchant}</span>
            <span className="flex items-center gap-1 shrink-0">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-gray-500">{rating}</span>
            </span>
          </div>

          <Link to={`/product/${pid}`}>
            <h3 className="text-[15px] font-medium text-gray-800 line-clamp-2 leading-snug hover:text-amber-700 transition-colors">
              {title}
            </h3>
          </Link>

          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <div>
              {origPrice && <p className="text-xs text-gray-400 line-through mb-0.5">${parseFloat(origPrice).toFixed(2)}</p>}
              <p className="text-lg font-bold text-gray-900">${parseFloat(price || 0).toFixed(2)}</p>
            </div>
            <a href={buyLink} target="_blank" rel="nofollow noopener" onClick={handleBuy}>
              <Button size="sm" variant="accent" className="gap-1.5">
                Buy <ExternalLink size={12} />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
