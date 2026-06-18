import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, Star, Share2, Flame } from 'lucide-react';
import { Button } from './ui/Button';

const ProductCard = ({ product }) => {
  const copyToClipboard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const link = `${window.location.origin}/go/${product.slug}`;
    navigator.clipboard.writeText(link);
    alert('Affiliate link copied to clipboard!');
  };

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.image,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.merchant
    },
    "offers": {
      "@type": "Offer",
      "url": `${window.location.origin}/product/${product.id}`,
      "priceCurrency": "USD",
      "price": product.price,
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": "85"
    }
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
      <motion.div
        className="glass-card group overflow-hidden flex flex-col h-full hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 relative"
      >
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-4 left-4 z-10 animate-bounce">
            <div className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-orange-500/30 uppercase tracking-tighter">
              <Flame size={10} /> Save {product.discount}%
            </div>
          </div>
        )}

        {/* Share Button */}
        <button 
          onPointerUp={copyToClipboard}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500"
        >
          <Share2 size={14} />
        </button>

        <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full border border-orange-500/20">
              {product.merchant}
            </span>
            <div className="flex items-center text-yellow-500 ml-auto">
              <Star size={10} fill="currentColor" />
              <span className="text-[10px] ml-1 font-bold">{product.rating}</span>
            </div>
          </div>
          
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-orange-500 transition-colors">
            {product.title}
          </h3>
          <p className="text-gray-500 dark:text-white/50 text-[11px] mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-white/5">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 line-through leading-none mb-0.5">
                ${(parseFloat(product.price) * (1 + (product.discount || 0)/100)).toFixed(2)}
              </span>
              <span className="text-base font-black text-gray-900 dark:text-white">${product.price}</span>
            </div>
            
            <Link to={`/go/${product.slug}`} target="_blank" rel="nofollow noopener">
              <Button size="sm" className="h-9 px-4 text-[10px] font-black uppercase tracking-widest gap-2 bg-gray-900 dark:bg-orange-500">
                View on {product.merchant} <ExternalLink size={12} />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProductCard;
