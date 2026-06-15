import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, Star } from 'lucide-react';
import { Button } from './ui/Button';

const ProductCard = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card group overflow-hidden flex flex-col h-full hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-premium-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <span className="text-white text-sm font-medium">View Details</span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-orange-500/20">
            {product.category || 'Featured'}
          </span>
          <div className="flex items-center text-yellow-500 ml-auto">
            <Star size={12} fill="currentColor" />
            <span className="text-xs ml-1 font-medium">{product.rating || '4.8'}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{product.title}</h3>
        <p className="text-white/60 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <span className="text-xl font-bold text-white">${product.price}</span>
          <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" onPointerUp={(e) => e.stopPropagation()}>
            <Button size="sm" className="gap-2">
              Buy <ExternalLink size={14} />
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
