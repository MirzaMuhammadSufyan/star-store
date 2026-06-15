import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, TrendingUp, ShieldCheck, Zap, ArrowRight, Smartphone, Watch, Laptop, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/Button';

const HomePage = () => {
  const { products } = useProductStore();
  const featuredProducts = products.slice(0, 4);

  const categories = [
    { name: 'Smartphones', icon: Smartphone, color: 'bg-blue-500' },
    { name: 'Wearables', icon: Watch, color: 'bg-purple-500' },
    { name: 'Laptops', icon: Laptop, color: 'bg-orange-500' },
    { name: 'Audio', icon: Headphones, color: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden rounded-[2rem] md:rounded-[3rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-premium-purple/20 to-transparent dark:from-premium-purple/10" />
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
           <div className="relative h-full w-full">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square bg-gradient-radial from-premium-purple/20 to-transparent blur-3xl"
              />
              <motion.img
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                src="https://images.unsplash.com/photo-1546054454-aa26e2b734c7"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 rounded-3xl shadow-2xl rotate-3"
              />
           </div>
        </div>

        <div className="container mx-auto px-12 relative z-10">
          <div className="max-w-2xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-premium-purple/10 text-premium-purple border border-premium-purple/20 font-bold text-xs uppercase tracking-widest"
            >
              <Zap size={14} /> New Season Collection
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black dark:text-white leading-[1.1]"
            >
              Unleash Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium-purple to-premium-pink">Digital Edge.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed"
            >
              Experience the future of tech with our curated collection of premium gadgets. Performance, style, and innovation in every click.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/catalog">
                <Button size="lg" className="px-10 h-16 text-lg gap-3">
                  Shop Collection <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="glass" size="lg" className="px-10 h-16 text-lg border-gray-200 dark:border-white/10 dark:text-white text-gray-900">
                  Our Mission
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: ShieldCheck, title: 'Secure Shopping', desc: 'Verified affiliate links from official brand stores.' },
          { icon: Star, title: 'Premium Quality', desc: 'Hand-picked selection of the highest-rated gadgets.' },
          { icon: TrendingUp, title: 'Trending Tech', desc: 'Stay ahead with the latest releases in the industry.' },
        ].map((badge, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="glass-card p-8 dark:bg-white/5 bg-white border-gray-100 dark:border-white/10 flex items-start gap-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-premium-purple/10 flex items-center justify-center text-premium-purple shrink-0">
              <badge.icon size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold dark:text-white">{badge.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{badge.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Categories */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold dark:text-white">Shop by Category</h2>
            <p className="text-gray-500 dark:text-gray-400">Discover exactly what you need for your lifestyle</p>
          </div>
          <Link to="/catalog" className="text-premium-purple font-bold flex items-center gap-2 hover:translate-x-2 transition-transform">
            View All Catalog <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="relative aspect-square rounded-[2rem] overflow-hidden group cursor-pointer"
            >
              <div className={`absolute inset-0 ${cat.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className={`w-16 h-16 rounded-2xl ${cat.color} text-white flex items-center justify-center shadow-lg`}>
                  <cat.icon size={32} />
                </div>
                <h3 className="text-xl font-bold dark:text-white">{cat.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold dark:text-white">Trending Gadgets</h2>
            <p className="text-gray-500 dark:text-gray-400">Hand-picked premium selections for our community</p>
          </div>
          <div className="flex gap-2">
             <div className="px-4 py-2 bg-premium-purple text-white rounded-full text-sm font-bold">Best Sellers</div>
             <div className="px-4 py-2 bg-gray-100 dark:bg-white/5 dark:text-white text-gray-900 rounded-full text-sm font-bold">New Arrivals</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="glass-card bg-premium-dark text-white p-12 md:p-24 rounded-[3rem] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-30 pointer-events-none">
           <Zap className="w-full h-full text-premium-purple" />
        </div>
        <div className="max-w-3xl relative z-10 space-y-8">
          <h2 className="text-5xl md:text-7xl font-black leading-tight">Elevate Your Tech Game Today.</h2>
          <p className="text-xl text-white/60">Join over 10,000+ tech enthusiasts who trust Star Store for their daily gear.</p>
          <Button size="lg" variant="glass" className="h-16 px-12 border-white/20 text-white bg-white/5 hover:bg-white/10">
            Learn More About Us
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
