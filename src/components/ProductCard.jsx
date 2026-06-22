import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, Star, Share2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useAnalyticsStore } from '../store/analyticsStore';

const ProductCard = ({ product }) => {
  const logClick = useAnalyticsStore((state) => state.logClick);

  // Map AliExpress API fields to component needs
  const title = product.product_title || product.title;
  const image = product.product_main_image_url || product.image;
  const price = product.target_sale_price || product.price;
  const originalPriceRaw = product.original_price || (parseFloat(price) * 1.2).toFixed(2);
  const rating = product.evaluate_rate || product.rating || "4.9";
  const merchant = product.second_level_category_name || product.merchant || "Partner";
  const buyLink = product.promotion_link || (product.slug ? `/go/${product.slug}` : '#');
  const productId = product.product_id || product.id;

  // /go/:slug links log their own click in RedirectPage; only log here for direct promotion links
  const handleDealClick = () => {
    if (product.promotion_link) logClick(productId, merchant);
  };

  const discountPercent = useMemo(() => {
    if (!product.original_price || !price) return 0;
    const original = parseFloat(product.original_price);
    const current = parseFloat(price);
    if (original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  }, [product.original_price, price]);

  const copyToClipboard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const link = product.slug ? `${window.location.origin}/go/${product.slug}` : buyLink;
    navigator.clipboard.writeText(link);
    alert('Affiliate link copied to clipboard!');
  };

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": title,
    "image": image,
    "description": product.description || title,
    "brand": {
      "@type": "Brand",
      "name": merchant
    },
    "offers": {
      "@type": "Offer",
      "url": `${window.location.origin}/product/${productId}`,
      "priceCurrency": "USD",
      "price": price,
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": "85"
    }
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
      <motion.div
        className="glass-card group overflow-hidden flex flex-col h-full hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 relative"
      >
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-orange-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
              −{discountPercent}%
            </div>
          </div>
        )}

        {/* Share Button */}
        <button
          onPointerUp={copyToClipboard}
          className="absolute top-3 right-3 z-10 p-2 bg-white/90 dark:bg-black/60 border border-gray-100 dark:border-white/10 rounded-full text-gray-600 dark:text-white/80 opacity-0 group-hover:opacity-100 transition-all hover:text-gray-900 dark:hover:text-white"
        >
          <Share2 size={13} />
        </button>

        <Link to={`/product/${productId}`} className="block relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-600 dark:text-orange-400 text-[11px] uppercase tracking-wide font-medium">
              {merchant}
            </span>
            <div className="flex items-center text-amber-500 ml-auto">
              <Star size={11} fill="currentColor" />
              <span className="text-[11px] ml-1 text-gray-500 dark:text-white/50">{rating}</span>
            </div>
          </div>

          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {title}
          </h3>
          {product.description && (
            <p className="text-gray-500 dark:text-white/50 text-[12px] mb-4 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-white/5">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 line-through leading-none mb-0.5">
                ${originalPriceRaw}
              </span>
              <span className="text-base font-semibold text-gray-900 dark:text-white">${price}</span>
            </div>

            <a href={buyLink} target="_blank" rel="nofollow noopener" onClick={handleDealClick}>
              <Button size="sm" className="h-9 px-4 text-xs font-medium gap-2 bg-orange-600 text-white hover:bg-orange-700">
                View Deal <ExternalLink size={12} />
              </Button>
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProductCard;
