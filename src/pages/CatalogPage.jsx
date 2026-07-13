import React, {
  useState, useMemo, useEffect, useCallback, useRef,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal, Grid, List, X, ChevronDown, Loader2, ArrowUp,
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
  const { products, loading, syncLoading, syncFromAliExpress } = useProductStore();
  const { toggle, isFavourite } = useFavouriteStore();
  const [searchParams] = useSearchParams();

  const [search,       setSearch]       = useState(() => searchParams.get('cat') || '');
  const [selectedCats, setSelectedCats] = useState([]);
  const [maxPrice,     setMaxPrice]     = useState(null);
  const [sort,         setSort]         = useState('default');
  const [view,         setView]         = useState('grid');
  const [page,         setPage]         = useState(1);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [showTop,      setShowTop]      = useState(false);
  const [aliPage,      setAliPage]      = useState(1);
  const [aliKeyword,   setAliKeyword]   = useState('');
  const [noMorePages,  setNoMorePages]  = useState(false);

  const sentinelRef  = useRef(null);
  // Refs that store latest values without being in effect deps
  const aliPageRef   = useRef(1);
  const aliKwRef     = useRef('');
  const noMoreRef    = useRef(false);
  const syncRef      = useRef(false);
  const fetchingRef  = useRef(false);
  const filteredLen  = useRef(0);
  const visibleLen   = useRef(0);

  // Keep refs in sync with state / store
  useEffect(() => { aliPageRef.current  = aliPage;      }, [aliPage]);
  useEffect(() => { aliKwRef.current    = aliKeyword;   }, [aliKeyword]);
  useEffect(() => { noMoreRef.current   = noMorePages;  }, [noMorePages]);
  useEffect(() => { syncRef.current     = syncLoading;  }, [syncLoading]);

  // ── Initial load + react to ?cat= param changes ─────────────────────────────
  useEffect(() => {
    const kw = searchParams.get('cat') || 'tech';
    aliKwRef.current = kw;
    setAliKeyword(kw);
    setSearch(kw === 'tech' ? '' : kw);
    setAliPage(1);
    aliPageRef.current = 1;
    setNoMorePages(false);
    noMoreRef.current = false;
    setPage(1);
    syncFromAliExpress(kw, 1);
  }, [searchParams.get('cat')]); // eslint-disable-line

  // ── Scroll-to-top visibility ─────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Derived lists ────────────────────────────────────────────────────────────
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
        return qWords.every(w => title.includes(w));
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
    if (sort === 'rating')     list.sort((a, b) => parseFloat(b.evaluate_rate || b.rating || 0) - parseFloat(a.evaluate_rate || a.rating || 0));
    return list;
  }, [products, search, selectedCats, maxPrice, sort]);

  const visible = useMemo(() => filtered.slice(0, page * PER_PAGE), [filtered, page]);

  // Update refs so callbacks read latest values without stale closures
  filteredLen.current = filtered.length;
  visibleLen.current  = visible.length;

  // Core load function — called by both observer and the products-change effect
  const loadNext = useCallback(async () => {
    if (fetchingRef.current || noMoreRef.current || syncRef.current) return;
    fetchingRef.current = true;

    if (visibleLen.current < filteredLen.current) {
      setPage(p => p + 1);
      fetchingRef.current = false;
    } else if (filteredLen.current > 0) {
      const nextPage    = aliPageRef.current + 1;
      const newProducts = await syncFromAliExpress(aliKwRef.current || 'tech', nextPage);
      fetchingRef.current = false;
      if (!newProducts || newProducts.length === 0) {
        setNoMorePages(true);
        noMoreRef.current = true;
      } else {
        aliPageRef.current = nextPage;
        setAliPage(nextPage);
        setPage(p => p + 1);
      }
    } else {
      fetchingRef.current = false;
    }
  }, []); // eslint-disable-line

  // ── Scroll-based infinite load ───────────────────────────────────────────────
  // IntersectionObserver only fires on state change (enter/exit) so it misses
  // repeated triggers when sentinel stays in view after page increments.
  // A scroll listener on the window reliably detects "near bottom" every time —
  // scrolling authority lives on the main document, not an inner container.
  useEffect(() => {
    const check = () => {
      const { scrollY, innerHeight } = window;
      const scrollHeight = document.documentElement.scrollHeight;
      if (scrollHeight - scrollY - innerHeight < 600) loadNext();
    };

    window.addEventListener('scroll', check, { passive: true });
    // Also check immediately in case content already fills the viewport
    check();
    return () => window.removeEventListener('scroll', check);
  }, [loadNext]);

  // ── Re-trigger when new products arrive (may still be near bottom) ───────────
  useEffect(() => {
    if (filtered.length === 0) return;
    const { scrollY, innerHeight } = window;
    const scrollHeight = document.documentElement.scrollHeight;
    if (scrollHeight - scrollY - innerHeight < 600) loadNext();
  }, [filtered.length]); // eslint-disable-line

  const toggleCat = useCallback((cat) => {
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setSearch(''); setSelectedCats([]); setMaxPrice(null); setSort('default'); setPage(1);
  }, []);

  const hasFilters = !!(search || selectedCats.length || maxPrice || sort !== 'default');
  const sidebarProps = { categories, selectedCats, toggleCat, maxPrice, setMaxPrice, priceMax, hasFilters, reset };

  return (
    <div className="bg-canvas min-h-screen flex flex-col">

      {/* ── Sticky header ───────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-[4.5rem] z-20 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Title + count */}
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 shrink-0" style={{ fontFamily: "'Playfair Display', serif" }}>
                Product Catalog
              </h1>
              <span className="hidden sm:inline text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                {filtered.length} products
              </span>
              {syncLoading && (
                <Loader2 size={14} className="text-amber-500 animate-spin shrink-0" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column area — page itself is the only scroller ───────────────── */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex gap-6 items-start">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 py-6 md:sticky md:top-24 max-h-[calc(100vh-120px)]">
          <div className="bg-white border border-gray-200 rounded-xl flex flex-col shadow-card overflow-hidden h-full">
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
              <button onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded bg-white text-gray-700 hover:bg-gray-50">
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
                <select value={sort} onChange={e => setSort(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <div className="flex border border-gray-200 rounded overflow-hidden bg-white">
                <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-50'}`}><Grid size={16} /></button>
                <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-50'}`}><List size={16} /></button>
              </div>
            </div>
          </div>

          {/* Skeleton cards — shown only on first load when nothing is visible yet */}
          {syncLoading && visible.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-card animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-2 sm:p-3 flex flex-col gap-2">
                    <div className="h-2.5 bg-gray-200 rounded w-3/4" />
                    <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Filter chips */}
          {selectedCats.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {selectedCats.map(cat => (
                <span key={cat} className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-full font-medium">
                  {cat} <button onClick={() => toggleCat(cat)}><X size={12} /></button>
                </span>
              ))}
            </div>
          )}

          {/* Products */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200 rounded-xl shadow-card">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-500">Loading products…</p>
            </div>
          ) : visible.length === 0 && !syncLoading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200 rounded-xl shadow-card">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-gray-900 font-semibold">No products found</p>
              <p className="text-sm text-gray-500 mt-1">Try different keywords or adjust filters.</p>
              <button onClick={reset} className="mt-4 text-sm text-amber-700 hover:underline font-medium">Clear filters</button>
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

              {/* Sentinel / bottom loader — spans full grid width so it never
                  gets squeezed under the first column when few items match */}
              <div ref={sentinelRef} className="col-span-full text-center py-8 flex flex-col items-center justify-center gap-2">
                {syncLoading && visible.length > 0 && (
                  <>
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-2 h-2 rounded-full bg-amber-400"
                          style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 tracking-wide">Loading more products</p>
                  </>
                )}
                {noMorePages && (
                  <p className="text-xs text-gray-400 tracking-wide">You've seen everything ✓</p>
                )}
              </div>

              {visible.length > 0 && (
                <p className="col-span-full text-center text-xs text-gray-400 pb-4">
                  Showing {visible.length} of {filtered.length}
                </p>
              )}
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
                    className="bg-white border border-gray-200 rounded-xl shadow-card hover:border-amber-400 hover:shadow-lift transition-all">
                    <div className="flex gap-4 p-4">
                      {/* Clickable image */}
                      <Link to={`/product/${pid}`} className="relative shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-50 block">
                        <img src={image} alt={title} className="w-full h-full object-contain" />
                      </Link>

                      {/* Info */}
                      <div className="flex-grow min-w-0 flex flex-col justify-between">
                        <div>
                          {/* Category + badges */}
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold truncate">{category}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {discount > 0 && (
                                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded leading-none">
                                  -{discount}%
                                </span>
                              )}
                              <button
                                onClick={() => toggle(p)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 ${
                                  fav ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-gray-200 text-gray-400 hover:border-rose-400 hover:text-rose-500'
                                }`}
                                aria-label={fav ? 'Remove from saved' : 'Save'}
                              >
                                <Heart size={11} className={fav ? 'fill-white' : ''} />
                              </button>
                            </div>
                          </div>

                          {/* Clickable title */}
                          <Link to={`/product/${pid}`}>
                            <h3 className="text-sm font-medium text-gray-900 leading-snug hover:text-amber-700 transition-colors mt-0.5">
                              {title}
                            </h3>
                          </Link>

                          <div className="flex items-center gap-1 mt-1">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            <span className="text-[10px] text-gray-500 font-medium">{rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div>
                            {origPrice && <p className="text-xs text-gray-400 line-through">${parseFloat(origPrice).toFixed(2)}</p>}
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
            </div>
          )}

          {/* Sentinel / bottom loader — grid view renders its own col-span-full
              copy above so the indicator never gets squeezed under column 1 */}
          {view !== 'grid' && (
            <>
              <div ref={sentinelRef} className="mt-6 flex flex-col items-center justify-center pb-8 min-h-[60px] gap-2">
                {syncLoading && visible.length > 0 && (
                  <>
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-2 h-2 rounded-full bg-amber-400"
                          style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 tracking-wide">Loading more products</p>
                  </>
                )}
                {noMorePages && (
                  <p className="text-xs text-gray-400 tracking-wide">You've seen everything ✓</p>
                )}
              </div>

              {visible.length > 0 && (
                <p className="text-center text-xs text-gray-400 pb-4">
                  Showing {visible.length} of {filtered.length}
                </p>
              )}
            </>
          )}
          <style>{`@keyframes bounce{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(-6px);opacity:1}}`}</style>
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
