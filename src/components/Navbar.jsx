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
    { name: 'Contact', path: '/contact' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0c0c0d]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/[0.06] transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-orange-600 flex items-center justify-center">
            <ShoppingBag className="text-white" size={15} />
          </div>
          <span className="text-[15px] font-medium tracking-tight text-gray-900 dark:text-white">
            Star Store
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm transition-colors ${
                location.pathname === link.path
                  ? 'text-orange-600 dark:text-orange-400 font-medium'
                  : 'text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <button
            onPointerUp={toggleCart}
            className="p-2 relative rounded-lg text-gray-500 dark:text-white/60 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-500/10 transition-all"
          >
            <ShoppingCart size={19} />
            {getItemCount() > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-600 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                {getItemCount()}
              </span>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 ml-1">
            {isAuthenticated ? (
              <>
                <Link to="/admin/dashboard" className="p-2 rounded-lg text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                  <LayoutDashboard size={19} />
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
            className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5"
          >
            {isMobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-[#0c0c0d] p-6 border-b border-gray-100 dark:border-white/[0.06] shadow-lg z-40"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onPointerUp={() => setIsMobileMenuOpen(false)}
                  className="text-base text-gray-700 dark:text-white/80 border-b border-gray-50 dark:border-white/5 pb-3"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
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
