import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Grid, List, X, ChevronDown, Loader2 } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/Button';

const SORT_OPTIONS = [
  { label: 'Default',           value: 'default'    },
  { label: 'Price: Low → High', value: 'price_asc'  },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Top Rated',         value: 'rating'     },
];

// Sidebar is defined OUTSIDE the page so its identity is stable across renders.
// If it were inside CatalogPage, every keystroke would recreate the function →
// React unmounts + remounts it → input loses focus.
function Sidebar({ search, setSearch, setPage, categories, selectedCats, toggleCat, maxPrice, setMaxPrice, priceMax, hasFilters, reset, syncLoading }) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Search</p>
        <div className="relative">
          {syncLoading
            ? <Loader2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 animate-spin" />
            : <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          }
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products…"
            className="w-full pl-9 pr-3 py-3 text-[15px] border border-gray-200 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Category</p>
          <div className="space-y-1">
            {categories.slice(0, 12).map(cat => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group py-1">
                <input
                  type="checkbox"
                  checked={selectedCats.includes(cat)}
                  onChange={() => toggleCat(cat)}
                  className="w-4 h-4 accent-amber-600 rounded"
                />
                <span className="text-[15px] text-gray-600 group-hover:text-gray-900 transition-colors truncate">{cat}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Max Price</p>
          <span className="text-xs font-semibold text-amber-700">${maxPrice ?? priceMax}</span>
        </div>
        <input
          type="range"
          min={0}
          max={priceMax}
          step={50}
          value={maxPrice ?? priceMax}
          onChange={e => { setMaxPrice(parseInt(e.target.value)); setPage(1); }}
          className="w-full accent-amber-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$0</span><span>${priceMax}</span></div>
      </div>

      {hasFilters && (
        <button onClick={reset} className="w-full py-2 text-xs font-semibold text-red-500 border border-red-200 rounded hover:bg-red-50 transition-colors">
          Clear All Filters
        </button>
      )}
    </div>
  );
}

export default function CatalogPage() {
  const { products, loading, syncLoading, syncFromAliExpress } = useProductStore();
  const [search, setSearch]             = useState('');
  const [selectedCats, setSelectedCats] = useState([]);
  const [maxPrice, setMaxPrice]         = useState(null);
  const [sort, setSort]                 = useState('default');
  const [view, setView]                 = useState('grid');
  const [page, setPage]                 = useState(1);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const PER_PAGE = 12;

  useEffect(() => { syncFromAliExpress('tech'); }, []);

  // Auto-search AliExpress 600ms after the user stops typing
  useEffect(() => {
    const q = search.trim();
    if (!q) return;
    const t = setTimeout(() => syncFromAliExpress(q), 600);
    return () => clearTimeout(t);
  }, [search]);

  const priceMax = useMemo(() => {
    if (!products?.length) return 2000;
    return Math.max(200, Math.ceil(Math.max(...products.map(p => parseFloat(p.target_sale_price || p.price) || 0)) / 100) * 100);
  }, [products]);

  const categories = useMemo(() => {
    if (!products?.length) return [];
    return [...new Set(products.map(p => p.second_level_category_name || p.category || p.merchant).filter(Boolean))];
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...(products || [])];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => (p.product_title || p.title || '').toLowerCase().includes(q));
    }
    if (selectedCats.length) {
      list = list.filter(p => {
        const cat = p.second_level_category_name || p.category || p.merchant || '';
        return selectedCats.includes(cat);
      });
    }
    if (maxPrice) list = list.filter(p => parseFloat(p.target_sale_price || p.price || 0) <= maxPrice);
    if (sort === 'price_asc')  list.sort((a, b) => parseFloat(a.target_sale_price || a.price) - parseFloat(b.target_sale_price || b.price));
    if (sort === 'price_desc') list.sort((a, b) => parseFloat(b.target_sale_price || b.price) - parseFloat(a.target_sale_price || a.price));
    if (sort === 'rating')     list.sort((a, b) => parseFloat(b.evaluate_rate || b.rating || 0) - parseFloat(a.evaluate_rate || a.rating || 0));
    return list;
  }, [products, search, selectedCats, maxPrice, sort]);

  const visible = filtered.slice(0, page * PER_PAGE);

  const toggleCat = useCallback((cat) => {
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    setPage(1);
  }, []);

  const reset = useCallback(() => { setSearch(''); setSelectedCats([]); setMaxPrice(null); setSort('default'); setPage(1); }, []);
  const hasFilters = !!(search || selectedCats.length || maxPrice || sort !== 'default');

  const sidebarProps = {
    search, setSearch, setPage, categories, selectedCats, toggleCat,
    maxPrice, setMaxPrice, priceMax, hasFilters, reset, syncLoading,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs text-amber-700 uppercase tracking-widest font-semibold mb-1">All Products</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Product Catalog
          </h1>
          <p className="mt-2 text-gray-500 text-sm">{filtered.length} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-20">
              <Sidebar {...sidebarProps} />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-grow min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded bg-white text-gray-700 hover:bg-gray-50"
                >
                  <SlidersHorizontal size={15} /> Filters
                  {hasFilters && <span className="w-4 h-4 bg-amber-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">!</span>}
                </button>
                {hasFilters && (
                  <button onClick={reset} className="hidden lg:flex items-center gap-1.5 text-xs text-red-500 hover:underline">
                    <X size={12} /> Clear filters
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 ml-auto">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
                  >
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {/* View toggle */}
                <div className="flex border border-gray-200 rounded overflow-hidden bg-white">
                  <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-50'}`}><Grid size={16} /></button>
                  <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-50'}`}><List size={16} /></button>
                </div>
              </div>
            </div>

            {/* AliExpress sync banner */}
            {syncLoading && (
              <div className="flex items-center gap-3 mb-5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <Loader2 size={16} className="animate-spin shrink-0" />
                Fetching live results from AliExpress…
              </div>
            )}

            {/* Active filter chips */}
            {selectedCats.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedCats.map(cat => (
                  <span key={cat} className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-full font-medium">
                    {cat}
                    <button onClick={() => toggleCat(cat)}><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}

            {/* Products */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200 rounded-lg">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin mb-4" />
                <p className="text-sm text-gray-500">Loading products…</p>
              </div>
            ) : visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200 rounded-lg">
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-gray-900 font-semibold">No products found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search AliExpress.</p>
                <button onClick={reset} className="mt-4 text-sm text-amber-700 hover:underline font-medium">Clear filters</button>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {visible.map((p, i) => (
                  <motion.div
                    key={p.product_id || p.id || i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i % PER_PAGE) * 0.03 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {visible.map((p, i) => {
                  const title     = p.product_title || p.title;
                  const image     = p.product_main_image_url || p.image;
                  const price     = p.target_sale_price || p.price;
                  const origPrice = p.original_price;
                  const merchant  = p.merchant || 'AliExpress';
                  const category  = p.second_level_category_name || p.category || merchant;
                  const buyLink   = p.promotion_link || (p.slug ? `/go/${p.slug}` : '#');
                  return (
                    <motion.div
                      key={p.product_id || p.id || i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="bg-white border border-gray-200 rounded-lg flex gap-4 p-4 hover:border-amber-400 hover:shadow-sm transition-all"
                    >
                      <img src={image} alt={title} className="w-24 h-24 object-cover rounded shrink-0 bg-gray-50" />
                      <div className="flex-grow min-w-0 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold">{category}</span>
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mt-0.5">{title}</h3>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            {origPrice && <p className="text-xs text-gray-400 line-through">${parseFloat(origPrice).toFixed(2)}</p>}
                            <p className="text-base font-semibold text-gray-900">${parseFloat(price || 0).toFixed(2)}</p>
                          </div>
                          <a href={buyLink} target="_blank" rel="nofollow noopener">
                            <Button size="sm" variant="accent">Buy Now</Button>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Load more */}
            {visible.length < filtered.length && (
              <div className="mt-10 text-center">
                <Button variant="secondary" size="lg" onClick={() => setPage(p => p + 1)}>
                  Load More ({filtered.length - visible.length} remaining)
                </Button>
              </div>
            )}
            {visible.length > 0 && (
              <p className="text-center text-xs text-gray-400 mt-6">
                Showing {visible.length} of {filtered.length} products
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <p className="font-semibold text-gray-900">Filters</p>
              <button onClick={() => setSidebarOpen(false)}><X size={20} className="text-gray-500" /></button>
            </div>
            <div className="flex-grow overflow-y-auto p-5">
              <Sidebar {...sidebarProps} />
            </div>
            <div className="p-4 border-t border-gray-200">
              <Button variant="primary" className="w-full" onClick={() => setSidebarOpen(false)}>
                Show {filtered.length} Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
