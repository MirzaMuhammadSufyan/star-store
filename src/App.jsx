import React, { Suspense, lazy, useState, Component, useEffect } from 'react';
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

// Catches "Failed to fetch dynamically imported module" errors (stale deploy / network blip)
// and reloads the page once to fetch the fresh chunk.
class ChunkErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { errored: false }; }
  static getDerivedStateFromError(err) {
    const isChunkError = err?.message?.includes('Failed to fetch dynamically imported module')
      || err?.message?.includes('Importing a module script failed')
      || err?.name === 'ChunkLoadError';
    if (isChunkError && !sessionStorage.getItem('chunk_reload')) {
      sessionStorage.setItem('chunk_reload', '1');
      window.location.reload();
    }
    return { errored: true };
  }
  render() {
    if (this.state.errored) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
          <p className="text-lg font-semibold text-gray-900">Something went wrong loading this page.</p>
          <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();
  if (loading) return <div className="flex items-center justify-center h-[60vh] text-sm text-gray-400">Authenticating…</div>;
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <>
    <ScrollToTop />
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
          <Route path="/adminpanel"     element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
    </>
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
          <ChunkErrorBoundary>
            <Suspense fallback={<div className="flex items-center justify-center h-[60vh]"><div className="w-7 h-7 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin" /></div>}>
              <AnimatedRoutes />
            </Suspense>
          </ChunkErrorBoundary>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
