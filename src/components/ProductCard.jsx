import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ExternalLink } from 'lucide-react';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useFavouriteStore } from '../store/favouriteStore';
import { productDetailUrl } from '../utils/productUrl';
import { getBuyLink } from '../utils/productLinks';

const ProductCard = ({ product }) => {
  const logClick  = useAnalyticsStore((s) => s.logClick);
  const { toggle, isFavourite } = useFavouriteStore();

  const title     = product.product_title || product.title;
  const image     = product.product_main_image_url || product.image;
  const price     = product.target_sale_price || product.price;
  const origPrice = product.original_price;
  const rating    = product.evaluate_rate || product.rating || '4.8';
  const merchant  = product.merchant || 'AliExpress';
  const buyLink   = getBuyLink(product);
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
    if (buyLink && buyLink !== '#') {
      if (buyLink.startsWith('http')) {
        logClick(pid, merchant, { via: 'product-card' });
        window.open(buyLink, '_blank', 'noopener,noreferrer');
      } else {
        // Masked /go/:slug — RedirectPage logs once after consent check.
        window.location.href = buyLink;
      }
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

      <div className="group bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col hover:shadow-lg hover:border-amber-300 transition-all duration-200 h-full">

        {/* Image */}
        <Link to={productDetailUrl(product)} className="relative block overflow-hidden bg-gray-50 aspect-square shrink-0">
          <img
            src={image} alt={title} loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          {/* Discount badge — corner of image with clean margin */}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded leading-none z-10">
              -{discount}%
            </span>
          )}

          {/* Favourite — top right over image */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product); }}
            className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow transition-all duration-200 z-10 ${
              fav
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-rose-500'
            }`}
            aria-label={fav ? 'Remove from saved' : 'Save'}
          >
            <Heart size={12} className={fav ? 'fill-white' : ''} />
          </button>
        </Link>

        {/* Info */}
        <div className="p-2 sm:p-3 flex flex-col gap-1.5 flex-1">

          {/* Title */}
          <Link to={productDetailUrl(product)} className="flex-1">
            <p className="text-[11px] sm:text-[12px] text-gray-700 leading-snug line-clamp-2 min-h-[2.6em] hover:text-amber-700 transition-colors">
              {title}
            </p>
          </Link>

          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={9}
                className={parseFloat(rating) >= i ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
              />
            ))}
            <span className="text-[10px] text-gray-400 ml-1">{rating}</span>
          </div>

          {/* Price + single cart button */}
          <div className="flex items-center justify-between gap-1 mt-auto">
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

            {/* Single cart button */}
            <button
              onClick={handleBuy}
              className="shrink-0 w-8 h-8 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
              aria-label="Buy on partner store"
            >
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
