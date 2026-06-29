import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ExternalLink, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavouriteStore } from '../store/favouriteStore';
import { Button } from './ui/Button';

export default function FavouritesDrawer({ open, onClose }) {
  const { items, remove, clear } = useFavouriteStore();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <Heart size={18} className="text-rose-500 fill-rose-500" />
                <h2 className="font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Saved Items
                </h2>
                {items.length > 0 && (
                  <span className="text-xs bg-rose-50 border border-rose-200 text-rose-600 font-semibold px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-grow overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
                  <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center">
                    <Heart size={28} className="text-rose-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">No saved items yet</p>
                    <p className="text-sm text-gray-500">Tap the heart icon on any product to save it here.</p>
                  </div>
                  <Button variant="accent" size="md" onClick={onClose} className="gap-2">
                    <ShoppingBag size={15} /> Browse Products
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50 p-4 space-y-1">
                  <AnimatePresence initial={false}>
                    {items.map((product) => {
                      const pid      = product.product_id || product.id;
                      const title    = product.product_title || product.title;
                      const image    = product.product_main_image_url || product.image;
                      const price    = product.target_sale_price || product.price;
                      const merchant = product.second_level_category_name || product.merchant || 'Partner';
                      const buyLink  = product.promotion_link || (product.slug ? `/go/${product.slug}` : '#');

                      return (
                        <motion.li
                          key={pid}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-3 py-3 group"
                        >
                          <Link to={`/product/${pid}`} onClick={onClose} className="shrink-0">
                            <img
                              src={image}
                              alt={title}
                              className="w-16 h-16 object-cover rounded-lg bg-gray-50 border border-gray-100"
                            />
                          </Link>
                          <div className="flex-grow min-w-0 flex flex-col justify-between">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold">{merchant}</p>
                              <Link to={`/product/${pid}`} onClick={onClose}>
                                <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug hover:text-amber-700 transition-colors mt-0.5">
                                  {title}
                                </p>
                              </Link>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-base font-bold text-gray-900">${parseFloat(price || 0).toFixed(2)}</p>
                              <div className="flex items-center gap-1.5">
                                <a href={buyLink} target="_blank" rel="nofollow noopener">
                                  <Button size="xs" variant="accent" className="gap-1">
                                    Buy <ExternalLink size={10} />
                                  </Button>
                                </a>
                                <button
                                  onClick={() => remove(pid)}
                                  className="p-1.5 rounded text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                                  aria-label="Remove"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{items.length} saved {items.length === 1 ? 'item' : 'items'}</span>
                  <button onClick={clear} className="text-xs text-red-400 hover:text-red-600 hover:underline transition-colors">
                    Clear all
                  </button>
                </div>
                <Link to="/catalog" onClick={onClose}>
                  <Button variant="secondary" className="w-full gap-2">
                    <ShoppingBag size={15} /> Continue Browsing
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
