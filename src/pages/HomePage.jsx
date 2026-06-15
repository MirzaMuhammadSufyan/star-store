import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, TrendingUp, ShieldCheck, Zap, ArrowRight, Smartphone, Watch, Laptop, Headphones, Gift, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/Button';

const HomePage = () => {
  const { products } = useProductStore();
  const featuredProducts = products.slice(0, 4);

  const categories = [
    { name: 'Smartphones', icon: Smartphone, color: 'bg-orange-500' },
    { name: 'Wearables', icon: Watch, color: 'bg-orange-600' },
    { name: 'Laptops', icon: Laptop, color: 'bg-orange-700' },
    { name: 'Audio', icon: Headphones, color: 'bg-orange-400' },
  ];

  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden rounded-[4rem] border border-orange-500/10 bg-white dark:bg-black/20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-orange-500/5" />

        {/* Floating Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-20 left-[10%] w-12 h-12 bg-orange-500/20 rounded-2xl blur-xl"
          />
          <motion.div
            animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-40 left-[20%] w-20 h-20 bg-orange-500/10 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 right-[15%] w-64 h-64 bg-orange-500/5 rounded-full blur-[100px]"
          />
        </div>

        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
           <div className="relative h-full w-full">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square bg-orange-glow blur-3xl"
              />
              <motion.div
                initial={{ y: 100, opacity: 0, rotate: 10 }}
                animate={{ y: 0, opacity: 1, rotate: -3 }}
                transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] aspect-[4/5] glass-card p-4 border-white/20 bg-white/40 dark:bg-white/5 backdrop-blur-3xl shadow-2xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1546054454-aa26e2b734c7"
                  className="w-full h-full object-cover rounded-[2.5rem]"
                  alt="Feature Tech"
                />
                <div className="absolute -bottom-10 -right-10 glass-card p-6 bg-orange-500 text-white shadow-2xl animate-float">
                  <p className="text-4xl font-black">4.9/5</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">User Satisfaction</p>
                </div>
              </motion.div>
           </div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-2xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 font-bold text-xs uppercase tracking-widest"
            >
              <Zap size={14} /> New Season Collection
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-9xl font-black dark:text-white leading-[1] tracking-tighter"
            >
              Unleash Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500">Digital Edge.</span>
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
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
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
          <Link to="/catalog" className="text-orange-500 font-bold flex items-center gap-2 hover:translate-x-2 transition-transform">
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

      {/* Interactive Experience Teaser */}
      <section className="relative overflow-hidden py-24 rounded-[4rem] bg-gray-950 text-white">
        <div className="absolute inset-0 bg-orange-500/5" />
        <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Gift size={32} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">Can't decide on the <span className="text-orange-500">perfect gift?</span></h2>
            <p className="text-xl text-gray-400 leading-relaxed">Our AI-powered gift finder understands your personality and matches you with gear that actually matters.</p>
            <Link to="/gift-finder">
              <Button size="lg" className="bg-white text-black hover:bg-orange-500 hover:text-white px-10 h-16 text-xl gap-3">
                Try Gift Finder <Sparkles size={20} />
              </Button>
            </Link>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <motion.div
                key={i}
                whileHover={{ y: -10, scale: 1.05 }}
                className="aspect-square glass-card bg-white/5 border-white/10 flex items-center justify-center"
              >
                <Zap className="text-orange-500/20" size={64} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-500 text-xs font-black uppercase tracking-[0.3em]">
              <TrendingUp size={14} /> Global Hotlist
            </div>
            <h2 className="text-4xl md:text-7xl font-black dark:text-white leading-none">Trending Gadgets</h2>
          </div>
          <div className="flex bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-200 dark:border-white/10">
             <button className="px-6 py-2.5 bg-white dark:bg-orange-500 shadow-xl rounded-xl text-sm font-black dark:text-white text-gray-900">Best Sellers</button>
             <button className="px-6 py-2.5 rounded-xl text-sm font-black text-gray-500 hover:text-orange-500 transition-colors">New Arrivals</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="glass-card bg-premium-dark text-white p-12 md:p-24 rounded-[4rem] overflow-hidden relative border-none">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-30 pointer-events-none">
           <Zap className="w-full h-full text-orange-500" />
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
