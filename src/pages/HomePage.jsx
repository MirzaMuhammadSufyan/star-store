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

  return (
    <div className="space-y-16 md:space-y-20">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] py-16 md:py-0 flex items-center overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border border-orange-500/10 bg-white dark:bg-black/20 mx-2 md:mx-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-orange-500/5" />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-20 left-[10%] w-12 h-12 bg-orange-500/20 rounded-2xl blur-xl"
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
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-[4/5] glass-card p-4 border-white/20 bg-white/40 dark:bg-white/5 backdrop-blur-3xl shadow-2xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&q=80&w=800" 
                  className="w-full h-full object-cover rounded-[2rem]" 
                  alt="Feature Tech"
                />
                <div className="absolute -bottom-6 -right-6 glass-card p-4 md:p-6 bg-orange-500 text-white shadow-2xl animate-float">
                  <p className="text-2xl md:text-4xl font-black">4.9/5</p>
                  <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-80">User Satisfaction</p>
                </div>
              </motion.div>
           </div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-2xl space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 font-bold text-[10px] md:text-xs uppercase tracking-widest"
            >
              <Zap size={14} /> New Season Collection
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black dark:text-white leading-[1] tracking-tighter"
            >
              Unleash Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">Digital Edge.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-xl text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed"
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
                <Button size="lg" className="px-8 md:px-10 h-14 md:h-16 text-base md:text-lg gap-3">
                  Shop Collection <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="glass" size="lg" className="px-8 md:px-10 h-14 md:h-16 text-base md:text-lg border-gray-200 dark:border-white/10 dark:text-white text-gray-900">
                  Our Mission
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
        {[
          { icon: ShieldCheck, title: 'Secure Shopping', desc: 'Verified affiliate links from official brand stores.' },
          { icon: Star, title: 'Premium Quality', desc: 'Hand-picked selection of the highest-rated gadgets.' },
          { icon: TrendingUp, title: 'Trending Tech', desc: 'Stay ahead with the latest releases in the industry.' },
        ].map((badge, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="glass-card p-6 md:p-8 dark:bg-white/5 bg-white border-gray-100 dark:border-white/10 flex items-start gap-6"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
              <badge.icon size={24} md:size={28} />
            </div>
            <div className="space-y-1 md:space-y-2">
              <h3 className="text-lg md:text-xl font-bold dark:text-white">{badge.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{badge.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>


      {/* Featured Products */}
      <section className="space-y-6 md:space-y-10 px-4 md:px-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-orange-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">
              <TrendingUp size={14} /> Global Hotlist
            </div>
            <h2 className="text-3xl md:text-5xl font-black dark:text-white leading-none">Trending Gadgets</h2>
          </div>
          <div className="flex bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-200 dark:border-white/10 w-fit">
             <button className="px-4 md:px-6 py-2 md:py-2.5 bg-white dark:bg-orange-500 shadow-xl rounded-xl text-xs md:text-sm font-black dark:text-white text-gray-900">Best Sellers</button>
             <button className="px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-black text-gray-500 hover:text-orange-500 transition-colors">New Arrivals</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="relative p-10 md:p-24 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border-none mx-2 md:mx-0 bg-gray-900 dark:bg-white/[0.03] dark:border dark:border-white/10">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-orange-500 via-transparent to-orange-500/0" />
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none">
           <Zap className="w-full h-full text-orange-400" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-6 md:space-y-8 text-center md:text-left">
          <h2 className="text-4xl md:text-7xl font-black leading-tight text-white">Elevate Your Tech Game Today.</h2>
          <p className="text-lg md:text-xl text-white/60">Join over 10,000+ tech enthusiasts who trust Star Store for their daily gear.</p>
          <Button size="lg" variant="glass" className="h-14 md:h-16 px-8 md:px-12 border-white/20 text-white bg-white/5 hover:bg-white/10">
            Learn More About Us
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
