import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/Button';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-morphism px-6 py-3 rounded-2xl">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-premium-purple rounded-xl flex items-center justify-center shadow-lg shadow-premium-purple/30">
            <ShoppingBag className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Star<span className="text-premium-purple">Store</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-white/80 hover:text-white transition-colors px-2 py-1">Store</Link>
          {isAuthenticated ? (
            <>
              <Link to="/admin/dashboard" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <LayoutDashboard size={20} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Button
                variant="glass"
                size="sm"
                onPointerUp={() => { logout(); navigate('/'); }}
                className="gap-2"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Link to="/admin/login">
              <Button variant="glass" size="sm">Admin</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
