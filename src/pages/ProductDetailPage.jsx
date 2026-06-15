import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronLeft, ShieldCheck, Truck, RotateCcw, Star, ShoppingCart, Share2, Heart, Check } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useProductStore((state) => state.products.find((p) => p.id === id));
  const { addItem, openCart } = useCartStore();
  const [activeTab, setActiveTab] = React.useState('description');
  const [isAdded, setIsAdded] = React.useState(false);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Product Not Found</h2>
        <Button onPointerUp={() => navigate('/')}>Back to Store</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    openCart();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="glass"
          size="sm"
          onPointerUp={() => navigate(-1)}
          className="gap-2 dark:text-white border-gray-200 dark:border-white/10"
        >
          <ChevronLeft size={18} /> Back
        </Button>
        <div className="flex gap-2">
           <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-colors"><Share2 size={18} /></button>
           <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-colors"><Heart size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="glass-card p-4 overflow-hidden dark:bg-white/5 bg-white border-gray-100 dark:border-white/10">
            <img
              src={product.image}
              alt={product.title}
              className="w-full aspect-square object-cover rounded-2xl"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="glass-card p-1 dark:bg-white/5 bg-white border-gray-100 dark:border-white/10 cursor-pointer hover:border-orange-500 transition-colors">
                <img src={product.image} className="aspect-square object-cover rounded-lg opacity-50 hover:opacity-100 transition-opacity" alt="" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-10"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-orange-500/20">
                {product.category || 'Premium Selection'}
              </span>
              <div className="flex items-center text-yellow-500 gap-1 text-sm font-bold">
                <Star size={14} fill="currentColor" />
                <span>4.9 (128 Reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black dark:text-white leading-tight">{product.title}</h1>
            <div className="flex items-end gap-3">
               <span className="text-5xl font-black text-orange-500 tracking-tighter">${product.price}</span>
               <span className="text-xl text-gray-400 line-through mb-2">${(parseFloat(product.price) * 1.2).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className={`flex-grow h-16 text-lg gap-3 transition-all ${isAdded ? 'bg-green-500 hover:bg-green-600' : ''}`}
              onPointerUp={handleAddToCart}
            >
              {isAdded ? <Check size={24} /> : <ShoppingCart size={24} />}
              {isAdded ? 'Added to Cart' : 'Add to Cart'}
            </Button>
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-grow sm:flex-grow-0"
            >
              <Button variant="glass" size="lg" className="w-full h-16 px-10 text-lg border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-500/5 gap-2">
                Official Store <ExternalLink size={20} />
              </Button>
            </a>
          </div>

          {/* Tabs */}
          <div className="space-y-6">
            <div className="flex border-b border-gray-100 dark:border-white/5">
              {['description', 'specifications', 'shipping'].map((tab) => (
                <button
                  key={tab}
                  onPointerUp={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500" />
                  )}
                </button>
              ))}
            </div>

            <div className="text-gray-500 dark:text-gray-400 leading-relaxed min-h-[100px]">
              {activeTab === 'description' && (
                <p>{product.description} Built with industry-leading components and designed for maximum efficiency, this product represents the pinnacle of modern innovation. Every detail has been meticulously crafted to provide an unparalleled user experience.</p>
              )}
              {activeTab === 'specifications' && (
                <ul className="grid grid-cols-2 gap-4">
                  {[
                    ['Weight', '1.2 lbs'], ['Material', 'Premium Alloy'], ['Warranty', '2 Years'], ['Connectivity', 'Bluetooth 5.2']
                  ].map(([label, val]) => (
                    <li key={label} className="flex flex-col p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                      <span className="text-[10px] font-black uppercase text-gray-400">{label}</span>
                      <span className="font-bold dark:text-white">{val}</span>
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === 'shipping' && (
                <p>We offer worldwide shipping via premium carriers. Orders are typically processed within 24 hours. Standard shipping takes 3-5 business days, while express shipping arrives in 1-2 business days.</p>
              )}
            </div>
          </div>

          {/* Trust */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-100 dark:border-white/5">
            <div className="text-center">
              <ShieldCheck className="mx-auto text-orange-500 mb-2" size={24} />
              <span className="text-[10px] text-gray-500 dark:text-white/50 uppercase font-black">Secure Link</span>
            </div>
            <div className="text-center">
              <Truck className="mx-auto text-orange-500 mb-2" size={24} />
              <span className="text-[10px] text-gray-500 dark:text-white/50 uppercase font-black">Brand Direct</span>
            </div>
            <div className="text-center">
              <RotateCcw className="mx-auto text-orange-500 mb-2" size={24} />
              <span className="text-[10px] text-gray-500 dark:text-white/50 uppercase font-black">2Y Warranty</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
