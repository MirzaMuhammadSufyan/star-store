import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { useAuthStore } from './store/authStore';
import { ThemeProvider } from './ThemeProvider';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const BlogArchive = lazy(() => import('./pages/BlogArchive'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const RedirectPage = lazy(() => import('./pages/RedirectPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return <div className="flex items-center justify-center h-[60vh]">Authenticating...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/blog" element={<BlogArchive />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/legal/:type" element={<LegalPage />} />
          <Route path="/go/:slug" element={<RedirectPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard/*" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen relative bg-premium-surface-light dark:bg-premium-surface-dark transition-colors duration-300 flex flex-col">
          <div className="ambient-bg opacity-30 dark:opacity-100" />
          <Navbar />
          <CartDrawer />
          <main className="container mx-auto px-4 pt-24 pb-20 relative z-10 flex-grow">
            <Suspense fallback={<div className="flex items-center justify-center h-[60vh]">Loading...</div>}>
              <AnimatedRoutes />
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
