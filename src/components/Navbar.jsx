import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ShoppingCart, LayoutDashboard, LogOut, Menu, X, Newspaper } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { Button } from './ui/Button';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const { toggleCart, getItemCount } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Store', path: '/' },
    { name: 'Catalog', path: '/catalog' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-morphism bg-white/70 dark:bg-black/60 px-4 md:px-6 py-3 rounded-2xl border border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl transition-colors duration-300">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-premium-purple rounded-xl flex items-center justify-center shadow-lg shadow-premium-purple/30">
            <ShoppingBag className="text-white" size={20} />
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Star<span className="text-premium-purple">Store</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'text-premium-purple'
                  : 'text-gray-600 dark:text-white/70 hover:text-premium-purple dark:hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <button
            onPointerUp={toggleCart}
            className="p-2 relative rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/70 hover:text-premium-purple transition-all"
          >
            <ShoppingCart size={20} />
            {getItemCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-premium-purple text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {getItemCount()}
              </span>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/admin/dashboard" className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/70 hover:text-premium-purple">
                  <LayoutDashboard size={20} />
                </Link>
                <Button
                  variant="glass"
                  size="sm"
                  onPointerUp={() => { logout(); navigate('/'); }}
                  className="px-4 border-gray-200 dark:border-white/10 dark:text-white text-gray-900"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/admin/login">
                <Button variant="glass" size="sm" className="px-4 border-gray-200 dark:border-white/10 dark:text-white text-gray-900">Admin</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onPointerUp={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/70"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-24 left-4 right-4 bg-white dark:bg-premium-dark rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-2xl z-40"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onPointerUp={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-50 dark:border-white/5 pb-2"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-2">
                <span className="text-gray-500 dark:text-gray-400">Theme</span>
                <ThemeToggle />
              </div>
              <div className="pt-4">
                {isAuthenticated ? (
                  <Button className="w-full" onPointerUp={() => { logout(); navigate('/'); setIsMobileMenuOpen(false); }}>Logout</Button>
                ) : (
                  <Link to="/admin/login" onPointerUp={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">Admin Login</Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
