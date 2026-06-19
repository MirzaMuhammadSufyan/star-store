import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Grid, List, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import ProductCard from '../components/ProductCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const CatalogPage = () => {
  const { products, loading, error, syncFromAliExpress } = useProductStore();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [priceRange, setPriceRange] = useState(3000);
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    syncFromAliExpress(searchQuery || 'tech');
  }, [syncFromAliExpress]);

  const allTags = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return [...new Set(products.flatMap(p => p.tags || [p.second_level_category_name].filter(Boolean)))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter(p => {
      const title = p.product_title || p.title || '';
      const description = p.description || '';
      const price = parseFloat(p.target_sale_price || p.price || 0);
      const rating = parseFloat(p.evaluate_rate || p.rating || 0);
      const category = p.second_level_category_name || '';

      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = price <= priceRange;
      const matchesRating = rating >= minRating;
      const matchesTags = selectedTags.length === 0 || selectedTags.every(t => (p.tags || []).includes(t) || category === t);
      return matchesSearch && matchesPrice && matchesRating && matchesTags;
    });
  }, [products, searchQuery, priceRange, minRating, selectedTags]);

  const paginatedProducts = filteredProducts.slice(0, currentPage * itemsPerPage);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
    if (query.length > 2) {
      syncFromAliExpress(query);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            <TrendingUp size={12} /> Elite Collection
          </div>
          <h1 className="text-4xl md:text-5xl font-black dark:text-white text-orange-950">Affiliate Store</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-orange-500 shadow-lg dark:text-white text-orange-600' : 'text-gray-400'}`}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-orange-500 shadow-lg dark:text-white text-orange-600' : 'text-gray-400'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 bg-white dark:bg-white/2 border-gray-100 dark:border-white/5 sticky top-28">
            <div className="space-y-8">
              {/* Search */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Search size={14} className="text-orange-500" /> Quick Find
                </h3>
                <Input 
                  placeholder="Ex: Pro Max..." 
                  value={searchQuery}
                  onChange={handleSearch}
                  className="bg-gray-50 dark:bg-black/20 h-12"
                />
              </div>

              {/* Price */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-orange-500" /> Price Cap
                </h3>
                <div className="space-y-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="3000" 
                    step="100"
                    value={priceRange}
                    onChange={(e) => { setPriceRange(parseInt(e.target.value)); setCurrentPage(1); }}
                    className="w-full accent-orange-500"
                  />
                  <div className="flex justify-between text-[10px] font-black text-gray-500">
                    <span>$0</span>
                    <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded">UP TO ${priceRange}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Filter size={14} className="text-orange-500" /> Filter Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all border ${
                        selectedTags.includes(tag)
                          ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                          : 'bg-gray-50 dark:bg-white/5 text-gray-500 border-gray-100 dark:border-white/10 hover:border-orange-500/30'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTags([]);
                  setPriceRange(3000);
                  setMinRating(0);
                  setCurrentPage(1);
                }}
                className="w-full py-3 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-orange-500 hover:border-orange-500/50 transition-all"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-8 text-red-500 text-sm font-bold text-center">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 glass-card bg-gray-50 dark:bg-white/2 border-dashed border-gray-200 dark:border-white/10">
              <Zap className="text-orange-500 animate-pulse mb-4" size={48} />
              <h3 className="text-xl font-bold dark:text-white uppercase tracking-widest">Syncing Global Deals...</h3>
              <p className="text-gray-500 text-sm">Fetching the latest prices from AliExpress Gateway</p>
            </div>
          ) : paginatedProducts.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {paginatedProducts.map((product, idx) => {
                const productId = product.product_id || product.id || idx;
                const title = product.product_title || product.title;
                const image = product.product_main_image_url || product.image;
                const price = product.target_sale_price || product.price;
                const merchant = product.second_level_category_name || product.merchant || "Partner";
                const buyLink = product.promotion_link || (product.slug ? `/go/${product.slug}` : '#');

                return (
                  <motion.div
                    key={productId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (idx % 12) * 0.05 }}
                    className={viewMode === 'list' ? 'flex gap-6 glass-card p-4 items-center' : ''}
                  >
                    {viewMode === 'grid' ? (
                      <ProductCard product={product} />
                    ) : (
                      <>
                        <img src={image} className="w-40 h-40 rounded-2xl object-cover shadow-lg" alt="" />
                        <div className="flex-grow">
                           <div className="flex items-center gap-2 mb-2">
                             <span className="text-[10px] font-black text-orange-500 uppercase">{merchant}</span>
                             <div className="h-1 w-1 rounded-full bg-gray-300" />
                             <span className="text-[10px] font-bold text-gray-400 uppercase">{product.category || 'Deal'}</span>
                           </div>
                           <h3 className="text-xl font-black dark:text-white mb-2 line-clamp-1">{title}</h3>
                           {product.description && (
                             <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{product.description}</p>
                           )}
                           <div className="flex items-center justify-between">
                              <span className="text-2xl font-black dark:text-white">${price}</span>
                              <a href={buyLink} target="_blank" rel="noopener noreferrer">
                                  <Button size="sm" className="bg-gray-900 dark:bg-orange-500 font-black uppercase text-[10px] tracking-widest">View Deal</Button>
                              </a>
                           </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 glass-card bg-gray-50 dark:bg-white/2 border-dashed border-gray-200 dark:border-white/10">
              <Sparkles size={48} className="text-gray-200 mb-4" />
              <h3 className="text-xl font-bold dark:text-white">No matches found</h3>
              <p className="text-gray-500">Try broadening your search or resetting filters.</p>
            </div>
          )}

          {/* Infinite Scroll / Load More */}
          {filteredProducts.length > paginatedProducts.length && (
            <div className="mt-12 flex justify-center">
              <Button 
                onClick={() => setCurrentPage(prev => prev + 1)}
                variant="glass"
                className="px-12 h-14 font-black uppercase text-xs tracking-[0.2em] border-orange-500/20 text-orange-600 dark:text-orange-400"
              >
                Load More Discoveries <Zap size={16} className="ml-2" />
              </Button>
            </div>
          )}
          
          <div className="mt-12 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Showing {paginatedProducts.length} of {filteredProducts.length} Results
          </div>
        </main>
      </div>
    </div>
  );
};

export default CatalogPage;
