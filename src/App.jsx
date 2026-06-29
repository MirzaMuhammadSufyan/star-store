import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FavouritesDrawer from './components/FavouritesDrawer';
import { useAuthStore } from './store/authStore';

const HomePage          = lazy(() => import('./pages/HomePage'));
const CatalogPage       = lazy(() => import('./pages/CatalogPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const BlogArchive       = lazy(() => import('./pages/BlogArchive'));
const BlogPost          = lazy(() => import('./pages/BlogPost'));
const UserProfilePage   = lazy(() => import('./pages/UserProfilePage'));
const ContactPage       = lazy(() => import('./pages/ContactPage'));
const AboutPage         = lazy(() => import('./pages/AboutPage'));
const LegalPage         = lazy(() => import('./pages/LegalPage'));
const RedirectPage      = lazy(() => import('./pages/RedirectPage'));
const AdminLogin        = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard    = lazy(() => import('./pages/AdminDashboard'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();
  if (loading) return <div className="flex items-center justify-center h-[60vh] text-sm text-gray-400">Authenticating…</div>;
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          <Route path="/"               element={<HomePage />} />
          <Route path="/catalog"        element={<CatalogPage />} />
          <Route path="/product/:id"    element={<ProductDetailPage />} />
          <Route path="/blog"           element={<BlogArchive />} />
          <Route path="/blog/:id"       element={<BlogPost />} />
          <Route path="/profile"        element={<UserProfilePage />} />
          <Route path="/about"          element={<AboutPage />} />
          <Route path="/contact"        element={<ContactPage />} />
          <Route path="/legal/:type"    element={<LegalPage />} />
          <Route path="/go/:slug"       element={<RedirectPage />} />
          <Route path="/admin/login"    element={<AdminLogin />} />
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
  const [favOpen, setFavOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar onFavOpen={() => setFavOpen(true)} />
        <FavouritesDrawer open={favOpen} onClose={() => setFavOpen(false)} />
        <main className="flex-grow pt-16">
          <Suspense fallback={<div className="flex items-center justify-center h-[60vh] text-sm text-gray-400">Loading…</div>}>
            <AnimatedRoutes />
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
