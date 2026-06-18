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
      "name": product.merchant || "Partner"
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
      "ratingValue": product.rating || "4.9",
      "reviewCount": "85"
    }
  };

  const originalPrice = product.discount > 0
    ? (parseFloat(product.price) * (1 + product.discount / 100)).toFixed(2)
    : (parseFloat(product.price) * 1.2).toFixed(2);

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
      <motion.div
        className="glass-card group overflow-hidden flex flex-col h-full hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 relative"
      >
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 z-10 animate-bounce">
            <div className="bg-orange-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg shadow-orange-500/30 uppercase tracking-tighter">
              <Flame size={8} /> Save {product.discount}%
            </div>
          </div>
        )}

        {/* Share Button */}
        <button 
          onClick={copyToClipboard}
          className="absolute top-2 right-2 z-10 p-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500"
        >
          <Share2 size={12} />
        </button>

        <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        
        <div className="p-3 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[8px] font-black uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-full border border-orange-500/20">
              {product.merchant || "Partner"}
            </span>
            <div className="flex items-center text-yellow-500 ml-auto">
              <Star size={8} fill="currentColor" />
              <span className="text-[8px] ml-1 font-bold">{product.rating || "4.9"}</span>
            </div>
          </div>
          
          <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-orange-500 transition-colors">
            {product.title}
          </h3>
          <p className="text-gray-500 dark:text-white/50 text-[10px] mb-3 line-clamp-2 leading-tight">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-white/5">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 line-through leading-none mb-0.5">
                ${originalPrice}
              </span>
              <span className="text-sm font-black text-gray-900 dark:text-white">${product.price}</span>
            </div>
            
            <a href={`/go/${product.slug}`} target="_blank" rel="nofollow noopener">
              <Button size="sm" className="h-7 px-3 text-[8px] font-black uppercase tracking-widest gap-1 bg-gray-900 dark:bg-orange-500">
                View <ExternalLink size={10} />
              </Button>
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProductCard;
