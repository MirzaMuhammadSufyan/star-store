import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useAnalyticsStore } from '../store/analyticsStore';

const RedirectPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = useProductStore((state) => state.products.find(p => p.slug === slug));
  const logClick = useAnalyticsStore((state) => state.logClick);

  useEffect(() => {
    if (!product) {
      const timeout = setTimeout(() => navigate('/'), 2000);
      return () => clearTimeout(timeout);
    }

    logClick(product.id, product.merchant);

    const timer = setTimeout(() => {
      window.location.href = product.affiliateLink;
    }, 1500);

    return () => clearTimeout(timer);
  }, [product, navigate, logClick]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <h2 className="text-2xl font-bold dark:text-white mb-4">Product Not Found</h2>
        <p className="text-gray-500">Redirecting you back to the store...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 max-w-lg w-full space-y-8 border-orange-500/20"
      >
        <div className="relative">
          <Loader2 className="mx-auto text-orange-500 animate-spin" size={48} />
          <ShieldCheck className="absolute inset-0 mx-auto text-orange-500 mt-3" size={24} />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-black dark:text-white">Secure Redirect</h2>
          <p className="text-gray-500 leading-relaxed">
            Redirecting you to our verified partner store <span className="text-orange-600 dark:text-orange-400 font-bold">{product.merchant}</span> for secure checkout.
          </p>
        </div>

        <div className="pt-4 flex flex-col items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Verifying Link Stability</span>
          <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-orange-500"
            />
          </div>
        </div>

        <p className="text-[10px] text-gray-400 italic">
          Star Store uses secure masking to protect your data and session integrity.
        </p>
      </motion.div>
    </div>
  );
};

export default RedirectPage;
