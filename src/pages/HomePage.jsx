import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, RotateCcw, Truck, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { useBlogStore } from '../store/blogStore';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/Button';

const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

const SLIDES = [
  {
    badge:    'New Season Collection',
    heading:  <>Premium Tech,<br /><span className="text-amber-400">Curated</span> for You.</>,
    sub:      'Hand-picked gadgets from verified official stores. Performance, quality and trust — in every product.',
    cta:      { label: 'Shop Now',        path: '/catalog' },
    cta2:     { label: 'Read the Journal', path: '/blog'    },
    image:    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=1600',
    overlay:  'from-gray-950/85 to-gray-900/20',
  },
  {
    badge:    'Best Sellers',
    heading:  <>Top-Rated Gadgets<br />at <span className="text-amber-400">Unbeatable</span> Prices.</>,
    sub:      'Our most-loved products, verified, reviewed, and sourced from trusted official partner stores worldwide.',
    cta:      { label: 'View Best Sellers', path: '/catalog?sort=rating' },
    cta2:     { label: 'About Us',           path: '/about' },
    image:    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1600',
    overlay:  'from-indigo-950/80 to-indigo-900/10',
  },
  {
    badge:    'Exclusive Deals',
    heading:  <>Save Big on<br /><span className="text-amber-400">Premium</span> Electronics.</>,
    sub:      'Limited-time affiliate deals across smartphones, laptops, audio, wearables and more — updated daily.',
    cta:      { label: 'Explore Deals',     path: '/catalog' },
    cta2:     { label: 'Contact Us',         path: '/contact' },
    image:    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1600',
    overlay:  'from-emerald-950/80 to-emerald-900/10',
  },
];

const CATS = [
  { name: 'Smartphones', icon: '📱', path: '/catalog?cat=Smartphones' },
  { name: 'Laptops',     icon: '💻', path: '/catalog?cat=Laptops' },
  { name: 'Audio',       icon: '🎧', path: '/catalog?cat=Audio' },
  { name: 'Wearables',   icon: '⌚', path: '/catalog?cat=Wearables' },
  { name: 'Cameras',     icon: '📷', path: '/catalog?cat=Cameras' },
  { name: 'Accessories', icon: '🔌', path: '/catalog?cat=Accessories' },
];

const PERKS = [
  { icon: Truck,       label: 'Fast Delivery',  desc: 'Ships from official brand stores.' },
  { icon: ShieldCheck, label: 'Verified Links', desc: 'Every affiliate link is authenticated.' },
  { icon: RotateCcw,   label: 'Easy Returns',   desc: 'Handled by the official merchant.' },
];

const INTERVAL = 5000;

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [dir,     setDir]     = useState(1);

  const goTo = useCallback((idx, direction) => {
    setDir(direction);
    setCurrent(idx);
  }, []);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length, 1),  [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length, -1), [current, goTo]);

  useEffect(() => {
    const t = setTimeout(next, INTERVAL);
    return () => clearTimeout(t);
  }, [current, next]);

  const slide = SLIDES[current];

  const variants = {
    enter:   (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center:  { opacity: 1, x: 0 },
    exit:    (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  return (
    <section className="relative bg-gray-900 overflow-hidden" style={{ height: 'clamp(480px, 60vh, 680px)' }}>
      {/* Background images */}
      <AnimatePresence initial={false} custom={dir}>
        <motion.img
          key={`bg-${current}`}
          custom={dir}
          src={slide.image}
          alt=""
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 0.35, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay} transition-all duration-700`} />

      {/* Text content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={current}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="max-w-xl space-y-6"
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded">
              {slide.badge}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {slide.heading}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">{slide.sub}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to={slide.cta.path}>
                <Button size="lg" variant="accent" className="gap-2">
                  {slide.cta.label} <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to={slide.cta2.path}>
                <Button size="lg" className="bg-white/10 text-white border border-white/20 hover:bg-white/20 gap-2">
                  {slide.cta2.label}
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/25 transition-colors backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/25 transition-colors backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'bg-amber-400 w-7' : 'bg-white/40 w-2 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-6 right-6 text-white/50 text-sm font-medium tabular-nums">
        {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { products } = useProductStore();
  const { posts }    = useBlogStore();

  const featured  = products.slice(0, 8);
  const newest    = products.slice(0, 4);
  const blogItems = posts.slice(0, 3);

  return (
    <div className="bg-gray-50">

      {/* ── Hero Slider ── */}
      <HeroSlider />

      {/* ── Perks bar ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {PERKS.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4 py-5 px-6">
                <Icon size={22} className="text-amber-600 shrink-0" strokeWidth={1.75} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Shop by Category
          </h2>
          <Link to="/catalog" className="text-sm text-amber-700 hover:underline font-medium flex items-center gap-1">
            All <ChevronRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATS.map(({ name, icon, path }) => (
            <Link
              key={name}
              to={path}
              className="group flex flex-col items-center gap-2 py-5 px-2 bg-white border border-gray-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-all text-center"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-medium text-gray-700 group-hover:text-amber-700 transition-colors">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured products ── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-amber-700 uppercase tracking-wider font-semibold mb-1">Hand-picked</p>
              <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Featured Products
              </h2>
            </div>
            <Link to="/catalog">
              <Button variant="secondary" size="sm" className="gap-1.5">View All <ArrowRight size={14} /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {featured.map((p, i) => (
              <FadeUp key={p.id || p.product_id} delay={i * 0.04}>
                <ProductCard product={p} />
              </FadeUp>
            ))}
          </div>
        </section>
      )}

      {/* ── Promo banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-xl bg-amber-600 overflow-hidden relative">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-amber-500/40" />
          <div className="absolute -left-8 -top-8 w-32 h-32 rounded-full bg-amber-700/40" />
          <div className="relative p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white space-y-2">
              <p className="text-xs uppercase tracking-widest font-semibold opacity-80">Limited Time</p>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Exclusive Deals</h2>
              <p className="text-amber-100 max-w-md text-base leading-relaxed">
                Best prices through verified official affiliate channels. Curated, tested, and trusted.
              </p>
            </div>
            <Link to="/catalog" className="shrink-0">
              <Button className="bg-white text-amber-700 hover:bg-amber-50 font-semibold px-8 gap-2">
                Browse Deals <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── New arrivals ── */}
      {newest.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-amber-700 uppercase tracking-wider font-semibold mb-1">Just In</p>
              <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>New Arrivals</h2>
            </div>
            <Link to="/catalog">
              <Button variant="secondary" size="sm" className="gap-1.5">See More <ArrowRight size={14} /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
            {newest.map((p, i) => (
              <FadeUp key={p.id || p.product_id} delay={i * 0.04}>
                <ProductCard product={p} />
              </FadeUp>
            ))}
          </div>
        </section>
      )}

      {/* ── From the Journal ── */}
      {blogItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-amber-700 uppercase tracking-wider font-semibold mb-1">Editorial</p>
              <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>From the Journal</h2>
            </div>
            <Link to="/blog">
              <Button variant="secondary" size="sm" className="gap-1.5">All Articles <ArrowRight size={14} /></Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {blogItems.map((post, i) => (
              <FadeUp key={post.id} delay={i * 0.06}>
                <Link to={`/blog/${post.id}`} className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={post.image} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold">{post.category}</span>
                    <h3 className="mt-2 text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-700 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    <p className="mt-4 text-xs text-amber-700 font-medium flex items-center gap-1">
                      Read more <ChevronRight size={13} />
                    </p>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
