import React from 'react';
import { Search, X } from 'lucide-react';

// Shortcut suggestions only — clicking one just fills the box and fires the
// same real AliExpress search as typing would. Nothing here is a stand-in
// for actual listings; every result on screen always comes from the
// AliExpress affiliate API via /api/products/sync.
const POPULAR_SEARCHES = [
  'Laptops', 'Smartphones', 'Smart Watch', 'Wireless Earbuds',
  'Bluetooth Speaker', 'Gaming Mouse', 'Mechanical Keyboard', 'Phone Case',
  'Camera', 'Drone', 'Tablet', 'Power Bank', 'LED Lights', 'Backpack',
  'Cycling Gear', 'VR Headset',
];

const SearchBar = ({ value, onChange, onSubmit }) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const suggestions = React.useMemo(() => {
    const q = value.trim().toLowerCase();
    const pool = q
      ? POPULAR_SEARCHES.filter((s) => s.toLowerCase().includes(q))
      : POPULAR_SEARCHES;
    return pool.slice(0, 8);
  }, [value]);

  const pick = (term) => {
    onChange(term);
    onSubmit(term);
    setOpen(false);
  };

  const submitCurrent = () => {
    onSubmit(value.trim());
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Search size={20} className="absolute left-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={value}
          onFocus={() => setOpen(true)}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onKeyDown={(e) => { if (e.key === 'Enter') submitCurrent(); if (e.key === 'Escape') setOpen(false); }}
          placeholder="Search for laptops, phones, gadgets…"
          className="w-full h-14 pl-12 pr-28 text-base border-2 border-gray-200 rounded-full bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all"
        />
        {value && (
          <button
            type="button"
            onClick={() => { onChange(''); onSubmit(''); }}
            className="absolute right-24 text-gray-400 hover:text-gray-700"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
        <button
          type="button"
          onClick={submitCurrent}
          className="absolute right-2 h-10 px-5 flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-full transition-colors"
        >
          <Search size={15} /> Search
        </button>
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg z-30 overflow-hidden">
          <p className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            {value.trim() ? 'Suggestions' : 'Popular searches'}
          </p>
          <ul className="pb-2">
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => pick(s)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors text-left"
                >
                  <Search size={14} className="text-gray-400" />
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
