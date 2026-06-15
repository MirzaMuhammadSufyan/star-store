import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, ChevronLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { Button } from '../components/ui/Button';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useProductStore((state) => state.products.find((p) => p.id === id));

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Button onPointerUp={() => navigate('/')}>Back to Store</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Button
        variant="glass"
        size="sm"
        onPointerUp={() => navigate('/')}
        className="mb-8 gap-2"
      >
        <ChevronLeft size={18} /> Back to Collection
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-2 overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full aspect-square object-cover rounded-xl"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <span className="text-premium-purple font-bold tracking-widest text-xs uppercase mb-2 block">
              {product.category || 'Premium Selection'}
            </span>
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{product.title}</h1>
            <p className="text-3xl font-bold text-premium-pink">${product.price}</p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <p className="text-white/70 leading-relaxed">
              {product.description}
            </p>

            <div className="pt-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <ShieldCheck className="mx-auto text-premium-purple mb-2" size={24} />
                <span className="text-[10px] text-white/50 uppercase font-bold">Secure Redirect</span>
              </div>
              <div className="text-center">
                <Truck className="mx-auto text-premium-purple mb-2" size={24} />
                <span className="text-[10px] text-white/50 uppercase font-bold">Official Store</span>
              </div>
              <div className="text-center">
                <RotateCcw className="mx-auto text-premium-purple mb-2" size={24} />
                <span className="text-[10px] text-white/50 uppercase font-bold">Verified Link</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button size="lg" className="w-full gap-3 py-6 text-xl">
                Buy from Official Store <ExternalLink size={24} />
              </Button>
            </a>
            <p className="text-center text-xs text-white/40 italic">
              Redirecting you to our official partner store for secure checkout.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
