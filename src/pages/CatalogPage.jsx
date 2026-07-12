import {
  useState, useMemo, useEffect, useCallback,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal, Grid, List, X, ChevronDown, ArrowUp,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useFavouriteStore } from '../store/favouriteStore';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/Button';
import { getBuyLink } from '../utils/productLinks';

const SORT_OPTIONS = [
  { label: 'Default',           value: 'default'    },
  { label: 'Price: Low → High', value: 'price_asc'  },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Top Rated',         value: 'rating'     },
];

const PER_PAGE = 12;

// Stable component identity — must live OUTSIDE the page function.
const CATS_VISIBLE = 6;

function Sidebar({ categories, selectedCats, toggleCat, maxPrice, setMaxPrice, priceMax, hasFilters, reset }) {
  const [showAllCats, setShowAllCats] = useState(false);
  const visibleCats = showAllCats ? categories.slice(0, 16) : categories.slice(0, CATS_VISIBLE);

  return (
    <div className="flex flex-col h-full min-h-0 gap-6">
      {categories.length > 0 && (
        <div className="flex flex-col min-h-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3 shrink-0">Category</p>
          <div className="space-y-1 overflow-y-auto pr-2">
            {visibleCats.map(cat => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group py-1">
                <input type="checkbox" checked={selectedCats.includes(cat)}
                  onChange={() => toggleCat(cat)} className="w-4 h-4 accent-amber-600 rounded shrink-0" />
                <span className="text-[14px] text-gray-600 group-hover:text-gray-900 transition-colors break-words">{cat}</span>
              </label>
            ))}
          </div>
          {categories.length > CATS_VISIBLE && (
            <button
              type="button"
              onClick={() => setShowAllCats(v => !v)}
              className="mt-2 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors shrink-0"
            >
              {showAllCats ? '- Show Less' : `+ Show More (${categories.length - CATS_VISIBLE})`}
            </button>
          )}
        </div>
      )}
      <div className="shrink-0">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Max Price</p>
          <span className="text-xs font-semibold text-amber-700">${maxPrice ?? priceMax}</span>
        </div>
        <label htmlFor="catalog-max-price" className="sr-only">Maximum price filter</label>
        <input
          id="catalog-max-price"
          type="range"
          min={0}
          max={priceMax}
          step={50}
          value={maxPrice ?? priceMax}
          onChange={e => setMaxPrice(parseInt(e.target.value))}
          className="w-full accent-amber-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1"><span>$0</span><span>${priceMax}</span></div>
      </div>
      {hasFilters && (
        <button onClick={reset} className="shrink-0 w-full py-2 text-xs font-semibold text-red-500 border border-red-200 rounded hover:bg-red-50 transition-colors">
          Clear All Filters
        </button>
      )}
    </div>
  );
}

export default function CatalogPage() {
  const { products, loading } = useProductStore();
  const { toggle, isFavourite } = useFavouriteStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = (() => {
    const cat = searchParams.get('cat') || '';
    return cat && cat !== 'tech' ? cat : '';
  })();
  const sort = searchParams.get('sort') || 'default';

  const [selectedCats, setSelectedCats] = useState([]);
  const [maxPrice,     setMaxPrice]     = useState(null);
  const [view,         setView]         = useState('grid');
  const [page,         setPage]         = useState(1);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [showTop,      setShowTop]      = useState(false);

  const setSort = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'default') next.set('sort', value);
    else next.delete('sort');
    setSearchParams(next, { replace: true });
    setPage(1);
  };

  // ── Scroll-to-top visibility ─────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Derived lists (Firestore catalog only — AliExpress sync is admin-only) ───
  const priceMax = useMemo(() => {
    if (!products?.length) return 2000;
    return Math.max(200, Math.ceil(
      Math.max(...products.map(p => parseFloat(p.target_sale_price || p.price) || 0)) / 100,
    ) * 100);
  }, [products]);

  const categories = useMemo(() => {
    if (!products?.length) return [];
    return [...new Set(
      products.map(p => p.second_level_category_name || p.category || p.merchant).filter(Boolean),
    )];
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...(products || [])];
    if (search) {
      const qWords = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
      list = list.filter(p => {
        const title = (p.product_title || p.title || '').toLowerCase();
        const cat = (p.second_level_category_name || p.category || p.merchant || '').toLowerCase();
        return qWords.every(w => title.includes(w) || cat.includes(w));
      });
    }
    if (selectedCats.length) {
      list = list.filter(p => selectedCats.includes(
        p.second_level_category_name || p.category || p.merchant || '',
      ));
    }
    if (maxPrice) list = list.filter(p => parseFloat(p.target_sale_price || p.price || 0) <= maxPrice);
    if (sort === 'price_asc')  list.sort((a, b) => parseFloat(a.target_sale_price || a.price) - parseFloat(b.target_sale_price || b.price));
    if (sort === 'price_desc') list.sort((a, b) => parseFloat(b.target_sale_price || b.price) - parseFloat(a.target_sale_price || a.price));
    if (sort === 'rating' || sort === 'popular') {
      list.sort((a, b) => parseFloat(b.evaluate_rate || b.rating || 0) - parseFloat(a.evaluate_rate || a.rating || 0));
    }
    return list;
  }, [products, search, selectedCats, maxPrice, sort]);

  const visible = useMemo(() => filtered.slice(0, page * PER_PAGE), [filtered, page]);
  const hasMore = visible.length < filtered.length;

  // ── Infinite scroll through local results ────────────────────────────────────
  useEffect(() => {
    const check = () => {
      if (!hasMore) return;
      const { scrollY, innerHeight } = window;
      const scrollHeight = document.documentElement.scrollHeight;
      if (scrollHeight - scrollY - innerHeight < 600) setPage((p) => p + 1);
    };
    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => window.removeEventListener('scroll', check);
  }, [hasMore, visible.length]);

  const toggleCat = useCallback((cat) => {
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setSelectedCats([]);
    setMaxPrice(null);
    setPage(1);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const hasFilters = !!(search || selectedCats.length || maxPrice || sort !== 'default');
  const sidebarProps = { categories, selectedCats, toggleCat, maxPrice, setMaxPrice, priceMax, hasFilters, reset };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">

      {/* ── Sticky header ───────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-[4.5rem] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Title + count */}
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 shrink-0" style={{ fontFamily: "'Playfair Display', serif" }}>
                Product Catalog
              </h1>
              <span className="hidden sm:inline text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                {filtered.length} products
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column area — page itself is the only scroller ───────────────── */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex gap-6 items-start">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 py-6 md:sticky md:top-24 max-h-[calc(100vh-120px)]">
          <div className="bg-white border border-gray-200 rounded-xl flex flex-col shadow-sm overflow-hidden h-full">
            <div className="px-5 pt-5 pb-3 border-b border-gray-100 shrink-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Filters</p>
            </div>
            <div className="px-5 py-4 flex-1 min-h-0">
              <Sidebar {...sidebarProps} />
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-grow min-w-0 py-6 pr-1">

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open filters"
                className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded bg-white text-gray-700 hover:bg-gray-50"
              >
                <SlidersHorizontal size={15} /> Filters
                {hasFilters && <span className="w-4 h-4 bg-amber-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">!</span>}
              </button>
              {hasFilters && (
                <button onClick={reset} className="hidden lg:flex items-center gap-1.5 py-1 text-xs text-red-500 hover:underline">
                  <X size={12} /> Clear
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <div className="relative">
                <label htmlFor="catalog-sort" className="sr-only">Sort products</label>
                <select id="catalog-sort" value={sort} onChange={e => setSort(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" aria-hidden />
              </div>
              <div className="flex border border-gray-200 rounded overflow-hidden bg-white">
                <button type="button" onClick={() => setView('grid')} aria-label="Grid view" aria-pressed={view === 'grid'} className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center ${view === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}><Grid size={16} /></button>
                <button type="button" onClick={() => setView('list')} aria-label="List view" aria-pressed={view === 'list'} className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center ${view === 'list' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}><List size={16} /></button>
              </div>
            </div>
          </div>

          {/* Filter chips */}
          {selectedCats.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {selectedCats.map(cat => (
                <span key={cat} className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-full font-medium">
                  {cat}
                  <button type="button" onClick={() => toggleCat(cat)} aria-label={`Remove ${cat} filter`}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200 rounded-xl">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-500">Loading products…</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200 rounded-xl">
              <p className="text-gray-900 font-semibold">No products found</p>
              <p className="text-sm text-gray-500 mt-1">Try different keywords or adjust filters. Import products from Admin → Sync.</p>
              <button type="button" onClick={reset} className="mt-4 text-sm text-amber-700 hover:underline font-medium">Clear filters</button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visible.map((p, i) => (
                <motion.div key={p.product_id || p.id || i}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % PER_PAGE) * 0.03 }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
              <p className="col-span-full text-center text-xs text-gray-500 pb-4">
                Showing {visible.length} of {filtered.length}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {visible.map((p, i) => {
                const title     = p.product_title || p.title;
                const image     = p.product_main_image_url || p.image;
                const price     = p.target_sale_price || p.price;
                const origPrice = p.original_price;
                const rating    = p.evaluate_rate || p.rating || '4.8';
                const merchant  = p.merchant || 'AliExpress';
                const category  = p.second_level_category_name || p.category || merchant;
                const buyLink   = getBuyLink(p);
                const pid       = p.product_id || p.id;
                const fav       = isFavourite(p);
                const discount  = (() => {
                  if (!origPrice || !price) return 0;
                  const orig = parseFloat(origPrice), cur = parseFloat(price);
                  return orig > cur ? Math.round(((orig - cur) / orig) * 100) : 0;
                })();
                return (
                  <motion.div key={pid || i}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="bg-white border border-gray-200 rounded-xl hover:border-amber-400 hover:shadow-sm transition-all">
                    <div className="flex gap-4 p-4">
                      <Link to={`/product/${pid}`} className="relative shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-50 block">
                        <img src={image} alt={title} className="w-full h-full object-contain" />
                      </Link>
                      <div className="flex-grow min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold truncate">{category}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {discount > 0 && (
                                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded leading-none">
                                  -{discount}%
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => toggle(p)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${
                                  fav ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-rose-400 hover:text-rose-500'
                                }`}
                                aria-label={fav ? 'Remove from saved' : 'Save'}
                              >
                                <Heart size={11} className={fav ? 'fill-white' : ''} />
                              </button>
                            </div>
                          </div>
                          <Link to={`/product/${pid}`}>
                            <h2 className="text-sm font-medium text-gray-900 leading-snug hover:text-amber-700 transition-colors mt-0.5">
                              {title}
                            </h2>
                          </Link>
                          <div className="flex items-center gap-1 mt-1">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            <span className="text-[10px] text-gray-500 font-medium">{rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            {origPrice && <p className="text-xs text-gray-500 line-through">${parseFloat(origPrice).toFixed(2)}</p>}
                            <p className="text-base font-bold text-gray-900">${parseFloat(price || 0).toFixed(2)}</p>
                          </div>
                          <a
                            href={buyLink}
                            target={buyLink.startsWith('http') ? '_blank' : undefined}
                            rel={buyLink.startsWith('http') ? 'nofollow noopener' : undefined}
                          >
                            <Button size="sm" variant="accent">Buy Now</Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <p className="text-center text-xs text-gray-500 pb-4 mt-2">
                Showing {visible.length} of {filtered.length}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <p className="font-semibold text-gray-900">Filters</p>
              <button type="button" aria-label="Close filters" onClick={() => setSidebarOpen(false)}><X size={20} className="text-gray-500" /></button>
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

      {/* Scroll-to-top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-gray-900 text-white shadow-lg flex items-center justify-center hover:bg-amber-600 transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
