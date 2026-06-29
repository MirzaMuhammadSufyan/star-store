import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, ChevronLeft, ChevronRight, ShieldCheck, Truck, RotateCcw,
  Star, Heart, Share2, X
} from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useFavouriteStore } from '../store/favouriteStore';
import { Button } from '../components/ui/Button';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProductStore();
  const logClick = useAnalyticsStore(s => s.logClick);
  const { toggle, isFavourite } = useFavouriteStore();
  const raw      = products.find(p => p.id === id || String(p.product_id) === id);

  const [activeImg,  setActiveImg]  = React.useState(0);
  const [lightbox,   setLightbox]   = React.useState(false);
  const [copied,     setCopied]     = React.useState(false);
  const [activeTab,  setActiveTab]  = React.useState('description');

  React.useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );

  if (!raw) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-gray-900 font-semibold">Product not found</p>
      <Button onClick={() => navigate('/')}>Back to Store</Button>
    </div>
  );

  const p = {
    id:          raw.id || raw.product_id,
    title:       raw.product_title || raw.title,
    image:       raw.product_main_image_url || raw.image,
    price:       parseFloat(raw.target_sale_price || raw.price || 0),
    origPrice:   parseFloat(raw.original_price || 0),
    rating:      raw.evaluate_rate || raw.rating || '4.8',
    merchant:    raw.second_level_category_name || raw.merchant || 'Partner',
    category:    raw.first_level_category_name || raw.category || '',
    description: raw.description || '',
    buyLink:     raw.promotion_link || (raw.slug ? `/go/${raw.slug}` : '#'),
  };

  const gallery     = [p.image, ...(raw.product_small_image_urls || [])].filter(Boolean).filter((s, i, a) => a.indexOf(s) === i);
  const discount    = p.origPrice > p.price ? Math.round(((p.origPrice - p.price) / p.origPrice) * 100) : 0;
  const displayOrig = p.origPrice || (p.price * 1.2);
  const related     = products.filter(r => (r.id || r.product_id) !== p.id).slice(0, 4);
  const fav         = isFavourite(raw);

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/product/${p.id}`);
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  const TABS = [
    { id: 'description',    label: 'Description'    },
    { id: 'specifications', label: 'Specifications' },
    { id: 'shipping',       label: 'Shipping'       },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-gray-900 transition-colors">
            <ChevronLeft size={15} /> Back
          </button>
          <span>/</span>
          <Link to="/catalog" className="hover:text-gray-900 transition-colors">Catalog</Link>
          {p.category && <><span>/</span><span className="text-gray-400 truncate max-w-[12rem]">{p.category}</span></>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Gallery */}
          <div className="space-y-3">
            <div
              className="relative bg-white border border-gray-200 rounded-xl overflow-hidden cursor-zoom-in"
              onClick={() => setLightbox(true)}
            >
              {discount > 0 && (
                <span className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded">
                  -{discount}%
                </span>
              )}
              {/* Favourite on gallery */}
              <button
                onClick={(e) => { e.stopPropagation(); toggle(raw); }}
                className={`absolute top-3 left-3 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow transition-all ${
                  fav ? 'bg-rose-500 text-white' : 'bg-white text-gray-400 hover:text-rose-500 border border-gray-200'
                }`}
              >
                <Heart size={18} className={fav ? 'fill-white' : ''} />
              </button>
              <AnimatePresence mode="wait">
                <motion.img
                  key={gallery[activeImg]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  src={gallery[activeImg]}
                  alt={p.title}
                  className="w-full aspect-square object-cover"
                />
              </AnimatePresence>
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {gallery.slice(0, 5).map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      activeImg === i ? 'border-amber-500' : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Category + rating */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                {p.category || 'General'}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <Star size={14} className="fill-amber-400 text-amber-400" /> {p.rating} <span className="text-gray-400">(128 reviews)</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {p.title}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-3 py-4 border-y border-gray-100">
              <span className="text-3xl font-bold text-gray-900">${p.price.toFixed(2)}</span>
              {discount > 0 && <span className="text-lg text-gray-400 line-through mb-0.5">${displayOrig.toFixed(2)}</span>}
              {discount > 0 && <span className="text-sm font-semibold text-green-600 mb-0.5">Save {discount}%</span>}
            </div>

            {/* Action row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={p.buyLink} target="_blank" rel="nofollow noopener" onClick={() => logClick(p.id, p.merchant)} className="flex-grow">
                <Button size="lg" variant="accent" className="w-full gap-2">
                  Buy on {p.merchant} <ExternalLink size={16} />
                </Button>
              </a>
              <Button
                size="lg"
                variant={fav ? 'primary' : 'secondary'}
                onClick={() => toggle(raw)}
                className={`gap-2 shrink-0 ${fav ? 'bg-rose-500 border-rose-500 hover:bg-rose-600' : ''}`}
              >
                <Heart size={17} className={fav ? 'fill-white' : ''} />
                {fav ? 'Saved' : 'Save'}
              </Button>
            </div>

            {/* Share */}
            <button onClick={handleShare} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
              <Share2 size={15} /> {copied ? 'Link copied!' : 'Share this product'}
            </button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              {[
                { icon: ShieldCheck, label: 'Verified Link' },
                { icon: Truck,       label: 'Brand Direct' },
                { icon: RotateCcw,   label: 'Easy Returns' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 py-3 bg-gray-50 rounded-lg">
                  <Icon size={20} className="text-amber-600" strokeWidth={1.75} />
                  <span className="text-xs text-gray-600 font-medium text-center">{label}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="flex border-b border-gray-200">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id ? 'text-amber-700 bg-amber-50 border-b-2 border-amber-600' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="p-5 text-sm text-gray-600 leading-relaxed min-h-[100px]"
                >
                  {activeTab === 'description' && (
                    <p>{p.description || `${p.title} — sourced from our verified partner network. Click "Buy on ${p.merchant}" to see full details on the official store.`}</p>
                  )}
                  {activeTab === 'specifications' && (
                    <div className="grid grid-cols-2 gap-2">
                      {[['Merchant', p.merchant], ['Category', p.category || 'General'], ['Rating', p.rating], ['Status', 'In Stock']].map(([label, val]) => (
                        <div key={label} className="bg-gray-50 rounded p-3">
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">{label}</p>
                          <p className="text-sm font-medium text-gray-900">{val}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'shipping' && (
                    <p>Shipping details, delivery times and return policies are handled by <strong>{p.merchant}</strong>. Please refer to the official store page for accurate information in your region.</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                You May Also Like
              </h2>
              <Link to="/catalog" className="text-sm text-amber-700 hover:underline font-medium">View all</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {related.map(prod => <ProductCard key={prod.id || prod.product_id} product={prod} />)}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
              <X size={20} />
            </button>
            {gallery.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + gallery.length) % gallery.length); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % gallery.length); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            <img src={gallery[activeImg]} alt={p.title} onClick={e => e.stopPropagation()} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
