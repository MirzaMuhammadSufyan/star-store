import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, ChevronLeft, ChevronRight, ShieldCheck, Truck, RotateCcw, Star,
  ShoppingCart, Share2, Heart, Check, Zap, ZoomIn, X, Minus, Plus, FileText, ListChecks, PackageCheck
} from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { Button } from '../components/ui/Button';
import ProductCard from '../components/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProductStore();
  const rawProduct = products.find((p) => p.id === id || String(p.product_id) === id);
  const { addItem, openCart } = useCartStore();
  const logClick = useAnalyticsStore((state) => state.logClick);

  const [activeTab, setActiveTab] = React.useState('description');
  const [isAdded, setIsAdded] = React.useState(false);
  const [activeImage, setActiveImage] = React.useState(0);
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const [isZooming, setIsZooming] = React.useState(false);
  const [zoomPos, setZoomPos] = React.useState({ x: 50, y: 50 });
  const [copied, setCopied] = React.useState(false);
  const imageRef = React.useRef(null);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Zap className="text-orange-500 animate-pulse mb-4" size={48} />
        <h2 className="text-xl font-bold dark:text-white">Loading Product Details...</h2>
      </div>
    );
  }

  if (!rawProduct) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Product Not Found</h2>
        <Button onClick={() => navigate('/')}>Back to Store</Button>
      </div>
    );
  }

  // Normalize fields across Firestore-stored products and live AliExpress API results
  const product = {
    id: rawProduct.id || rawProduct.product_id,
    title: rawProduct.product_title || rawProduct.title,
    image: rawProduct.product_main_image_url || rawProduct.image,
    price: rawProduct.target_sale_price || rawProduct.price,
    originalPrice: rawProduct.original_price,
    rating: rawProduct.evaluate_rate || rawProduct.rating,
    merchant: rawProduct.second_level_category_name || rawProduct.merchant,
    category: rawProduct.first_level_category_name || rawProduct.category,
    description: rawProduct.description,
    discount: rawProduct.discount || 0,
    slug: rawProduct.slug,
    buyLink: rawProduct.promotion_link || (rawProduct.slug ? `/go/${rawProduct.slug}` : '#')
  };

  // Build a real gallery from whatever images the source actually provides —
  // AliExpress search results include product_small_image_urls alongside the main image.
  const gallery = [product.image, ...(rawProduct.product_small_image_urls || [])]
    .filter(Boolean)
    .filter((src, i, arr) => arr.indexOf(src) === i);

  const relatedProducts = products
    .filter((p) => (p.id || p.product_id) !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    openCart();
  };

  // /go/:slug links log their own click in RedirectPage; only log here for direct promotion links
  const handleDealClick = () => {
    if (rawProduct.promotion_link) logClick(product.id, product.merchant);
  };

  const handleShare = () => {
    const link = `${window.location.origin}/product/${product.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleMouseMove = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const originalPrice = product.originalPrice
    ? parseFloat(product.originalPrice).toFixed(2)
    : product.discount > 0
      ? (parseFloat(product.price) * (1 + product.discount / 100)).toFixed(2)
      : (parseFloat(product.price) * 1.2).toFixed(2);

  const discountPercent = Math.max(0, Math.round(((originalPrice - product.price) / originalPrice) * 100));

  const tabs = [
    { id: 'description', label: 'Description', icon: FileText },
    { id: 'specifications', label: 'Specifications', icon: ListChecks },
    { id: 'shipping', label: 'Shipping', icon: PackageCheck },
  ];

  return (
    <div key={id} className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            <ChevronLeft size={16} /> Back
          </button>
          <span className="opacity-40">/</span>
          <Link to="/catalog" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Catalog</Link>
          {product.category && (
            <>
              <span className="opacity-40">/</span>
              <span className="text-gray-500 dark:text-gray-400 truncate max-w-[10rem]">{product.category}</span>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button
              onPointerUp={handleShare}
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-white/60 transition-colors"
            >
              <Share2 size={18} />
            </button>
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-full right-0 mt-1 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2.5 py-1 rounded-md"
                >
                  Link Copied
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onPointerUp={() => setIsWishlisted((w) => !w)}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <motion.span whileTap={{ scale: 1.3 }} className="block">
              <Heart
                size={18}
                className={isWishlisted ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-white/60'}
                fill={isWishlisted ? 'currentColor' : 'none'}
              />
            </motion.span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div
            ref={imageRef}
            className="relative glass-card overflow-hidden dark:bg-white/5 bg-white border-gray-100 dark:border-white/10 cursor-zoom-in group"
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setIsLightboxOpen(true)}
          >
            {discountPercent > 0 && (
              <div className="absolute top-4 left-4 z-10 bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-sm">
                −{discountPercent}%
              </div>
            )}
            <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={16} className="text-gray-700 dark:text-white/80" />
            </div>
            <AnimatePresence mode="wait">
              <motion.img
                key={gallery[activeImage]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                src={gallery[activeImage]}
                alt={product.title}
                className="w-full aspect-square object-cover rounded-2xl select-none"
                style={
                  isZooming
                    ? { transform: 'scale(1.8)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transition: 'transform 0.1s ease-out' }
                    : { transition: 'transform 0.3s ease-out' }
                }
              />
            </AnimatePresence>
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {gallery.slice(0, 5).map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActiveImage(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === i
                      ? 'border-orange-500 ring-2 ring-orange-500/20'
                      : 'border-gray-100 dark:border-white/10 hover:border-orange-500/40'
                  }`}
                >
                  <img src={src} className="w-full h-full object-cover" alt={`${product.title} view ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-orange-500/20">
                {product.category || 'Premium Selection'}
              </span>
              <div className="flex items-center text-amber-500 gap-1 text-sm font-bold">
                <Star size={14} fill="currentColor" />
                <span className="text-gray-600 dark:text-gray-300">{product.rating || '4.9'} (128 Reviews)</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold dark:text-white leading-tight">{product.title}</h1>
            <div className="flex items-end gap-3">
               <span className="text-4xl font-bold text-orange-600 dark:text-orange-400 tracking-tight">${product.price}</span>
               {discountPercent > 0 && <span className="text-lg text-gray-400 line-through mb-1">${originalPrice}</span>}
            </div>
          </div>

          {/* Quantity stepper */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Quantity</span>
            <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-11 h-11 flex items-center justify-center text-gray-500 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-semibold dark:text-white">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-11 h-11 flex items-center justify-center text-gray-500 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className={`flex-grow h-16 text-lg gap-3 transition-all ${isAdded ? 'bg-green-500 hover:bg-green-600' : ''}`}
              onClick={handleAddToCart}
            >
              {isAdded ? <Check size={24} /> : <ShoppingCart size={24} />}
              {isAdded ? 'Added to Cart' : 'Add to Cart'}
            </Button>
            <a
              href={product.buyLink}
              target="_blank"
              rel="nofollow noopener"
              onClick={handleDealClick}
              className="flex-grow sm:flex-grow-0"
            >
              <Button variant="glass" size="lg" className="w-full h-16 px-10 text-lg border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-500/5 gap-2">
                View Deal on {product.merchant || 'Partner Store'} <ExternalLink size={20} />
              </Button>
            </a>
          </div>

          {/* Tabs */}
          <div className="space-y-6">
            <div className="flex border-b border-gray-100 dark:border-white/5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-all relative ${
                    activeTab === tab.id ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
                  }`}
                >
                  <tab.icon size={15} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-gray-500 dark:text-gray-400 leading-relaxed min-h-[100px]"
              >
                {activeTab === 'description' && (
                  <p>{product.description || `${product.title} — sourced from our verified partner network.`}</p>
                )}
                {activeTab === 'specifications' && (
                  <ul className="grid grid-cols-2 gap-3">
                    {[
                      ['Merchant', product.merchant || 'Verified Vendor'], ['Category', product.category || 'General'], ['Status', 'Verified Link'], ['Rating', product.rating || '4.9']
                    ].map(([label, val]) => (
                      <li key={label} className="flex flex-col p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                        <span className="text-[10px] font-semibold uppercase text-gray-400">{label}</span>
                        <span className="font-medium dark:text-white">{val}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === 'shipping' && (
                  <p>Refer to the partner store website for precise shipping details and availability in your region.</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Trust */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-100 dark:border-white/5">
            {[
              { icon: ShieldCheck, label: 'Secure Link' },
              { icon: Truck, label: 'Brand Direct' },
              { icon: RotateCcw, label: 'Verified Deal' },
            ].map(({ icon: Icon, label }) => (
              <motion.div key={label} whileHover={{ y: -3 }} className="text-center">
                <Icon className="mx-auto text-orange-500 mb-2" size={22} />
                <span className="text-[10px] text-gray-500 dark:text-white/50 uppercase font-semibold">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 space-y-6">
          <h2 className="text-2xl font-bold dark:text-white">You may also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id || p.product_id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
            {gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveImage((i) => (i - 1 + gallery.length) % gallery.length); }}
                  className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveImage((i) => (i + 1) % gallery.length); }}
                  className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
            <motion.img
              key={gallery[activeImage]}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={gallery[activeImage]}
              alt={product.title}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;
