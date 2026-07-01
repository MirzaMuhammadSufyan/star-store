import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Star, Heart } from 'lucide-react';
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
  const category  = product.second_level_category_name || product.category || product.merchant || 'General';
  const merchant  = product.merchant || 'AliExpress';
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
      <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col hover:shadow-md hover:border-amber-400 transition-all duration-200">

        {/* Image — aspect-square + object-contain so the full product is always visible */}
        <Link to={`/product/${pid}`} className="relative block overflow-hidden bg-gray-50 aspect-square">
          <img src={image} alt={title} loading="lazy" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
        </Link>

        {/* Info */}
        <div className="p-3 flex flex-col gap-1.5" style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif" }}>

          {/* Badges row — discount + favourite, now below the image */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-wide truncate">{category}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              {discount > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded leading-none">
                  -{discount}%
                </span>
              )}
              <button
                onClick={(e) => { e.preventDefault(); toggle(product); }}
                className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 ${
                  fav ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-gray-200 text-gray-400 hover:border-rose-400 hover:text-rose-500'
                }`}
                aria-label={fav ? 'Remove from saved' : 'Save'}
              >
                <Heart size={11} className={fav ? 'fill-white' : ''} />
              </button>
            </div>
          </div>

          <Link to={`/product/${pid}`}>
            <h3 className="text-[12px] font-medium text-gray-800 leading-snug hover:text-amber-700 transition-colors tracking-normal">
              {title}
            </h3>
          </Link>

          <div className="flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-[10px] text-gray-500 font-medium">{rating}</span>
          </div>

          <div className="flex items-center justify-between gap-1 mt-0.5">
            <div>
              {origPrice && (
                <p className="text-[10px] text-gray-400 line-through leading-none">${parseFloat(origPrice).toFixed(2)}</p>
              )}
              <p className="text-sm font-bold text-gray-900 tracking-tight">${parseFloat(price || 0).toFixed(2)}</p>
            </div>
            <a href={buyLink} target="_blank" rel="nofollow noopener" onClick={handleBuy}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded transition-colors">
              Buy <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
