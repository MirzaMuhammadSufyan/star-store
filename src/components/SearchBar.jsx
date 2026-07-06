import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';

const SUGGEST_DEBOUNCE_MS = 350;
const SUGGEST_COUNT = 6;

// Suggestions are real, live AliExpress listings — not a canned term list.
// As the user types, we hit the same /api/products/sync endpoint the full
// search uses (small page_size) and show the actual matching products
// (thumbnail, title, price). Clicking one goes straight to that real
// product's detail page; nothing here is fabricated or hardcoded.
const SearchBar = ({ value, onChange, onSubmit, compact = false }) => {
  const [open, setOpen] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const containerRef = React.useRef(null);
  const abortRef = React.useRef(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  React.useEffect(() => {
    const q = value.trim();
    if (q.length < 2) return;

    setLoading(true);
    const t = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(
          `/api/products/sync?keywords=${encodeURIComponent(q)}&page_size=${SUGGEST_COUNT}`,
          { signal: controller.signal },
        );
        const data = await res.json();
        setSuggestions(data.success ? (data.products || []) : []);
      } catch (err) {
        if (err.name !== 'AbortError') setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, SUGGEST_DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [value]);

  const pickProduct = (product) => {
    setOpen(false);
    navigate(`/product/${product.product_id}`);
  };

  const submitCurrent = () => {
    onSubmit(value.trim());
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Search size={compact ? 15 : 18} className={`absolute ${compact ? 'left-3.5' : 'left-5'} top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none`} />
        <input
          type="text"
          value={value}
          onFocus={() => setOpen(true)}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onKeyDown={(e) => { if (e.key === 'Enter') submitCurrent(); if (e.key === 'Escape') setOpen(false); }}
          placeholder={compact ? 'Search products…' : 'Search for laptops, phones, gadgets…'}
          className={
            compact
              ? 'w-full h-9 pl-9 pr-16 text-sm leading-none border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 transition-all'
              : 'w-full h-11 pl-12 pr-32 text-sm leading-none border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all'
          }
        />
        {value && (
          <button
            type="button"
            onClick={() => { onChange(''); onSubmit(''); setSuggestions([]); }}
            className={`absolute ${compact ? 'right-9' : 'right-28'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700`}
            aria-label="Clear search"
          >
            <X size={compact ? 14 : 16} />
          </button>
        )}
        {!compact && (
          <button
            type="button"
            onClick={submitCurrent}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-4 flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Search size={14} /> Search
          </button>
        )}
        {compact && (
          <button
            type="button"
            onClick={submitCurrent}
            aria-label="Search"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors"
          >
            <Search size={13} />
          </button>
        )}
      </div>

      {open && value.trim().length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Live results from AliExpress
            </p>
            {loading && <Loader2 size={13} className="text-amber-500 animate-spin" />}
          </div>

          {!loading && suggestions.length === 0 && (
            <p className="px-4 py-4 text-sm text-gray-400">No matching products yet — press Search for the full catalog.</p>
          )}

          <ul className="pb-2 max-h-96 overflow-y-auto">
            {suggestions.map((p) => (
              <li key={p.product_id}>
                <button
                  type="button"
                  onClick={() => pickProduct(p)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 transition-colors text-left"
                >
                  <img
                    src={p.product_main_image_url}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
                  />
                  <span className="min-w-0 flex-grow">
                    <span className="block text-sm text-gray-800 truncate">{p.product_title}</span>
                    <span className="block text-xs text-amber-700 font-semibold">${p.target_sale_price}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {suggestions.length > 0 && (
            <button
              type="button"
              onClick={submitCurrent}
              className="w-full border-t border-gray-100 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50 text-left"
            >
              See all results for "{value.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
