import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuthStore } from './store/authStore';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen relative">
        <div className="ambient-bg" />
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <Suspense fallback={<div className="flex items-center justify-center h-[60vh]">Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
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
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
