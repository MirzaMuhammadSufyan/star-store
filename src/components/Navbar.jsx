import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, LayoutDashboard, Menu, Search, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useFavouriteStore } from '../store/favouriteStore';
import { Button } from './ui/Button';
import MegaMenu, { MegaMenuTrigger } from './MegaMenu';
import SearchBar from './SearchBar';

const Navbar = ({ onFavOpen }) => {
  const { isAuthenticated, logout } = useAuthStore();
  const count = useFavouriteStore(s => s.count());
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [shopOpen, setShopOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const closeTimer = React.useRef(null);

  const submitSearch = (term) => {
    const q = (term || '').trim();
    navigate(q ? `/catalog?cat=${encodeURIComponent(q)}` : '/catalog');
    setSearchOpen(false);
  };

  const openShop = () => {
    clearTimeout(closeTimer.current);
    setShopOpen(true);
  };
  const scheduleCloseShop = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setShopOpen(false), 200);
  };

  const links = [
    { label: 'Home',    path: '/' },
    { label: 'Shop',    path: '/catalog' },
    { label: 'Journal', path: '/blog' },
    { label: 'About',   path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-gradient-to-r after:from-amber-400 after:via-amber-500 after:to-amber-300">
      <div className="max-w-7xl mx-auto pl-4 pr-5 sm:pl-6 sm:pr-8 lg:pl-8 lg:pr-10 flex items-center gap-4 h-16">

        {/* Logo + desktop nav links */}
        <div className="flex items-center gap-8 shrink-0">
          <Link to="/" className="text-[22px] font-bold text-gray-900 shrink-0" style={{ fontFamily: "'Playfair Display', serif" }}>
            Star<span className="text-amber-600">Store</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`text-[15px] transition-colors ${
                location.pathname === '/' ? 'text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Home
            </Link>

            <MegaMenuTrigger
              label="Shop"
              path="/catalog"
              isActive={isActive('/catalog')}
              open={shopOpen}
              onOpen={openShop}
              onClose={scheduleCloseShop}
            />

            {links.filter(l => l.label !== 'Home' && l.label !== 'Shop').map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`text-[15px] transition-colors ${
                  isActive(path)
                    ? 'text-gray-900 font-semibold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Embedded search — centered between nav links and utility controls */}
        <div className="hidden md:flex flex-1 max-w-sm mx-auto">
          <SearchBar
            compact
            value={searchValue}
            onChange={setSearchValue}
            onSubmit={submitSearch}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen(v => !v)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Toggle search"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} strokeWidth={1.75} />}
          </button>

          {/* Favourites button */}
          <button
            onClick={onFavOpen}
            className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:text-rose-500 transition-colors"
            aria-label="Saved items"
          >
            <Heart size={21} strokeWidth={1.75} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-gray-200">
            {isAuthenticated ? (
              <>
                <Link to="/admin/dashboard" className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors" title="Dashboard">
                  <LayoutDashboard size={18} strokeWidth={1.75} />
                </Link>
                <Button variant="ghost" size="sm" onPointerUp={() => { logout(); navigate('/'); }}>
                  Sign out
                </Button>
              </>
            ) : null}
          </div>

          <button
            onPointerUp={() => setOpen(!open)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile search — stacks flush beneath the navbar line */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white border-b border-gray-200"
          >
            <div className="px-4 py-3">
              <SearchBar
                compact
                value={searchValue}
                onChange={setSearchValue}
                onSubmit={submitSearch}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MegaMenu open={shopOpen} onOpen={openShop} onClose={scheduleCloseShop} />

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-white border-b border-gray-200"
          >
            <nav className="px-4 py-3 flex flex-col gap-1">
              {links.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  onPointerUp={() => setOpen(false)}
                  className={`px-3 py-2.5 rounded text-[15px] transition-colors ${
                    isActive(path)
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </Link>
              ))}
              {/* Saved items in mobile menu */}
              <button
                onClick={() => { setOpen(false); onFavOpen(); }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded text-[15px] text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                <Heart size={16} /> Saved Items {count > 0 && <span className="ml-auto text-xs bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-bold">{count}</span>}
              </button>
              <div className="mt-2 pt-3 border-t border-gray-100 flex justify-end">
                {isAuthenticated ? (
                  <Button variant="ghost" size="sm" onPointerUp={() => { logout(); navigate('/'); setOpen(false); }}>
                    Sign out
                  </Button>
                ) : null}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
