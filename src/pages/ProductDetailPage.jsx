import React from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, ChevronLeft, ChevronRight, ShieldCheck, Truck, RotateCcw,
  Star, Heart, Share2, X, Copy, Check
} from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useFavouriteStore } from '../store/favouriteStore';
import { Button } from '../components/ui/Button';
import ProductCard from '../components/ProductCard';
import { encodeProductParam, decodeProductParam } from '../utils/productUrl';
import { getBuyLink } from '../utils/productLinks';

function normalizeProductImages(raw, mainImage) {
  let small = raw?.product_small_image_urls;
  if (small && !Array.isArray(small)) {
    if (Array.isArray(small.string)) small = small.string;
    else if (typeof small === 'object') small = Object.values(small).flat();
    else small = [];
  }
  return [mainImage, ...(small || [])]
    .filter(Boolean)
    .filter((src, i, arr) => arr.indexOf(src) === i);
}

function GalleryKeyboard({ enabled, onPrev, onNext, onClose }) {
  React.useEffect(() => {
    if (!enabled) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled, onPrev, onNext, onClose]);
  return null;
}

export default function ProductDetailPage() {
  const { id }             = useParams();
  const navigate           = useNavigate();
  const [searchParams]     = useSearchParams();
  const { products, loading: storeLoading, fetchProductById } = useProductStore();
  const logClick = useAnalyticsStore(s => s.logClick);
  const { toggle, isFavourite } = useFavouriteStore();

  // If arriving via share link (?d=...), decode product from URL — no API needed
  const sharedData = React.useMemo(() => {
    const d = searchParams.get('d');
    return d ? decodeProductParam(d) : null;
  }, [searchParams]);

  const [raw,       setRaw]       = React.useState(() => {
    if (sharedData) return sharedData;
    return products.find(p => p.id === id || String(p.product_id) === id) || null;
  });
  const [fetching,  setFetching]  = React.useState(!raw);
  const [notFound,  setNotFound]  = React.useState(false);
  const [activeImg, setActiveImg] = React.useState(0);
  const [lightbox,  setLightbox]  = React.useState(false);
  const [copied,      setCopied]      = React.useState(false);
  const [shareOpen,   setShareOpen]   = React.useState(false);
  const [activeTab,   setActiveTab]   = React.useState('description');

  React.useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImg(0);
    setLightbox(false);

    // Shared link with embedded data — no fetch needed
    if (sharedData) { setRaw(sharedData); setFetching(false); return; }

    const fromMemory = products.find(p => p.id === id || String(p.product_id) === id);
    if (fromMemory) { setRaw(fromMemory); setFetching(false); return; }

    setFetching(true);
    fetchProductById(id).then(result => {
      if (result) setRaw(result);
      else setNotFound(true);
      setFetching(false);
    });
  }, [id, sharedData]);

  // Once product is loaded, silently embed its data in the URL so refresh works
  React.useEffect(() => {
    if (!raw || sharedData) return;
    try {
    const payload = encodeProductParam({
      id:          raw.id || raw.product_id,
      product_id:  raw.product_id,
      product_title: raw.product_title || raw.title,
      product_main_image_url: raw.product_main_image_url || raw.image,
      product_small_image_urls: raw.product_small_image_urls || [],
      target_sale_price: raw.target_sale_price || raw.price,
      original_price:    raw.original_price,
      evaluate_rate:     raw.evaluate_rate || raw.rating,
      promotion_link:    raw.promotion_link,
      merchant:          raw.merchant,
      first_level_category_name: raw.first_level_category_name || raw.category,
      description:       raw.description,
    });
    const newUrl = `${window.location.pathname}?d=${payload}`;
    window.history.replaceState(null, '', newUrl);
    } catch (_) { /* skip URL embed if encoding fails */ }
  }, [raw, sharedData]);

  if (storeLoading || fetching) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Loading product…</p>
    </div>
  );

  if (notFound || !raw) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <p className="text-2xl">😕</p>
      <p className="text-gray-900 font-semibold">Product not found</p>
      <p className="text-sm text-gray-500 max-w-xs">This product may have been removed or the link may be incorrect.</p>
      <Button variant="accent" onClick={() => navigate('/catalog')}>Browse Catalog</Button>
    </div>
  );

  const p = {
    id:          raw.id || raw.product_id,
    title:       raw.product_title || raw.title,
    image:       raw.product_main_image_url || raw.image,
    price:       parseFloat(raw.target_sale_price || raw.price || 0),
    origPrice:   parseFloat(raw.original_price || 0),
    rating:      raw.evaluate_rate || raw.rating || '4.8',
    merchant:    raw.merchant || 'AliExpress',
    category:    raw.first_level_category_name || raw.second_level_category_name || raw.category || '',
    description: raw.description || '',
    buyLink:     getBuyLink(raw),
  };

  const gallery     = normalizeProductImages(raw, p.image);
  const discount    = p.origPrice > p.price ? Math.round(((p.origPrice - p.price) / p.origPrice) * 100) : 0;
  const displayOrig = p.origPrice || (p.price * 1.2);
  const related     = products.filter(r => (r.id || r.product_id) !== p.id).slice(0, 4);
  const fav         = isFavourite(raw);
  const safeImg     = Math.min(activeImg, Math.max(0, gallery.length - 1));

  const goPrev = () => setActiveImg((i) => (i - 1 + gallery.length) % gallery.length);
  const goNext = () => setActiveImg((i) => (i + 1) % gallery.length);

  const sharePayload = encodeProductParam({
    id:          p.id,
    product_id:  raw.product_id,
    product_title: p.title,
    product_main_image_url: p.image,
    product_small_image_urls: raw.product_small_image_urls || [],
    target_sale_price: p.price,
    original_price:    p.origPrice || undefined,
    evaluate_rate:     p.rating,
    promotion_link:    p.buyLink,
    merchant:          p.merchant,
    first_level_category_name: p.category,
    description:       p.description,
  });
  const shareUrl = `${window.location.origin}/product/${p.id || 'shared'}?d=${sharePayload}`;
  const shareText = encodeURIComponent(`Check out this product: ${p.title}`);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({ title: p.title, url: shareUrl });
    } else {
      setShareOpen(true);
    }
  };

  const TABS = [
    { id: 'description',    label: 'Description'    },
    { id: 'specifications', label: 'Specifications' },
    { id: 'shipping',       label: 'Shipping'       },
  ];

  return (
    <div className="bg-canvas min-h-screen">
      <GalleryKeyboard
        enabled={gallery.length > 1}
        onPrev={goPrev}
        onNext={goNext}
        onClose={() => setLightbox(false)}
      />
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 shadow-soft">
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

          {/* Gallery — modern multi-image viewer */}
          <div className="flex flex-col-reverse gap-3 lg:flex-row lg:items-start">
            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 lg:max-h-[min(520px,70vh)] lg:w-[4.5rem] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0 [scrollbar-width:thin]">
                {gallery.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-all lg:h-[4.25rem] lg:w-[4.25rem] ${
                      safeImg === i
                        ? 'border-amber-500 ring-2 ring-amber-500/20'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}

            <div className="relative min-w-0 flex-1">
              <div
                className="group relative cursor-zoom-in overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card"
                onClick={() => setLightbox(true)}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={gallery[safeImg] || p.image}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    src={gallery[safeImg] || p.image}
                    alt={p.title}
                    className="aspect-square w-full object-contain bg-gray-50 p-4 sm:p-6"
                  />
                </AnimatePresence>

                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={(e) => { e.stopPropagation(); goPrev(); }}
                      className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-soft opacity-100 transition hover:border-amber-400 hover:text-amber-800 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={(e) => { e.stopPropagation(); goNext(); }}
                      className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-soft opacity-100 transition hover:border-amber-400 hover:text-amber-800 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-gray-900/70 px-2.5 py-1 text-[11px] font-medium tabular-nums text-white">
                      {safeImg + 1} / {gallery.length}
                    </div>
                  </>
                )}
              </div>
              {gallery.length > 1 && (
                <p className="mt-2 text-center text-[11px] text-gray-400">
                  Click image to enlarge · use arrows to browse
                </p>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Category + rating */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                {p.category || 'General'}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <Star size={14} className="fill-amber-400 text-amber-400" /> {p.rating}
                <span className="text-gray-400">merchant rating</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {p.title}
            </h1>

            {/* Price + discount (not on image) */}
            <div className="flex items-end gap-3 py-4 border-y border-gray-100 flex-wrap">
              <span className="text-3xl font-bold text-gray-900">${p.price.toFixed(2)}</span>
              {discount > 0 && <span className="text-lg text-gray-400 line-through mb-0.5">${displayOrig.toFixed(2)}</span>}
              {discount > 0 && (
                <span className="mb-0.5 inline-flex items-center rounded bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                  -{discount}%
                </span>
              )}
              {discount > 0 && <span className="text-sm font-semibold text-green-600 mb-0.5">Save {discount}%</span>}
            </div>

            {/* Action row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={p.buyLink}
                target={p.buyLink.startsWith('http') ? '_blank' : undefined}
                rel={p.buyLink.startsWith('http') ? 'nofollow noopener' : undefined}
                onClick={() => {
                  if (p.buyLink.startsWith('http')) {
                    logClick(p.id, p.merchant, { via: 'product-detail' });
                  }
                }}
                className="flex-grow"
              >
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

            <p className="text-xs text-gray-400 leading-relaxed">
              As an affiliate, Star Store may earn a commission on qualifying purchases made through
              the link above at no extra cost to you. See our{' '}
              <Link to="/legal/disclaimer" className="text-amber-700 hover:underline">affiliate disclaimer</Link>.
            </p>

            {/* Share */}
            <div className="relative">
              <button
                onClick={handleNativeShare}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Share2 size={15} /> Share this product
              </button>

              <AnimatePresence>
                {shareOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setShareOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-8 z-50 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">Share Product</span>
                        <button onClick={() => setShareOpen(false)} className="text-gray-400 hover:text-gray-700">
                          <X size={16} />
                        </button>
                      </div>

                      {/* Product mini preview */}
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <img src={p.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{p.title}</p>
                          <p className="text-xs text-amber-600 font-bold mt-0.5">${p.price.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Share options */}
                      <div className="p-3 grid grid-cols-3 gap-2">
                        {/* WhatsApp */}
                        <a
                          href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShareOpen(false)}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-sm group-hover:shadow">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          </div>
                          <span className="text-[11px] text-gray-600 font-medium">WhatsApp</span>
                        </a>

                        {/* Facebook */}
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShareOpen(false)}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-sm group-hover:shadow">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                          </div>
                          <span className="text-[11px] text-gray-600 font-medium">Facebook</span>
                        </a>

                        {/* Twitter/X */}
                        <a
                          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShareOpen(false)}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-sm group-hover:shadow">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                          </div>
                          <span className="text-[11px] text-gray-600 font-medium">Twitter / X</span>
                        </a>
                      </div>

                      {/* Copy link */}
                      <div className="px-3 pb-3">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                          <span className="text-xs text-gray-500 truncate flex-grow font-mono">{shareUrl}</span>
                          <button
                            onClick={handleCopyLink}
                            className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                              copied
                                ? 'bg-green-500 text-white'
                                : 'bg-amber-500 text-white hover:bg-amber-600'
                            }`}
                          >
                            {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

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
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-card">
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
            <img
              src={gallery[safeImg] || p.image}
              alt={p.title}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[80vh] max-w-full rounded-lg object-contain"
            />
            {gallery.length > 1 && (
              <div
                className="absolute bottom-4 left-1/2 flex max-w-[90vw] -translate-x-1/2 gap-2 overflow-x-auto rounded-xl bg-black/40 p-2 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {gallery.map((src, i) => (
                  <button
                    key={`lb-${src}-${i}`}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 ${
                      safeImg === i ? 'border-amber-400' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-contain bg-white/10" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
