import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Sparkles, RefreshCcw, Link as LinkIcon, Globe, AlertCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { fetchProductDataFromUrl } from '../utils/parser';
import { withNormalizedLinks } from '../utils/productLinks';

const schema = z.object({
  title:         z.string().min(3, 'Title must be at least 3 characters'),
  description:   z.string().min(10, 'Description must be at least 10 characters'),
  price:         z.string().regex(/^\d+(\.\d{1,2})?$/, 'Use format: 29.99'),
  originalPrice: z.string().optional(),
  image:         z.string().url('Must be a valid image URL'),
  category:      z.string().min(2, 'Category is required'),
  affiliateLink: z.string().url('Must be a valid URL'),
});

/* Normalise a raw product object (could be manual or AliExpress) into form values */
const normalise = (p) => ({
  title:         p.product_title    || p.title         || '',
  description:   p.description                         || '',
  price:         String(p.target_sale_price || p.price || ''),
  originalPrice: String(p.original_price   || ''),
  image:         p.product_main_image_url  || p.image  || '',
  category:      p.second_level_category_name || p.category || p.merchant || '',
  affiliateLink: p.promotion_link   || p.affiliateLink  || '',
});

const EMPTY = { title: '', description: '', price: '', originalPrice: '', image: '', category: '', affiliateLink: '' };

const Field = ({ label, error, required, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={11} /> {error}
      </p>
    )}
  </div>
);

const ProductForm = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useProductStore();
  const [fetchUrl, setFetchUrl]       = useState('');
  const [fetching, setFetching]       = useState(false);
  const [fetchStep, setFetchStep]     = useState(0);
  const [fetchError, setFetchError]   = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } =
    useForm({
      resolver: zodResolver(schema),
      defaultValues: product ? normalise(product) : EMPTY,
    });

  const watchedImage = watch('image');
  const watchedLink  = watch('affiliateLink');

  const onSubmit = async (data) => {
    const payload = withNormalizedLinks({
      title:         data.title,
      description:   data.description,
      price:         data.price,
      original_price: data.originalPrice || undefined,
      image:         data.image,
      category:      data.category,
      affiliateLink: data.affiliateLink,
    });
    if (product) {
      await updateProduct(product.id, payload);
    } else {
      await addProduct(payload);
    }
    onClose();
  };

  const handleScrape = async () => {
    setFetchError('');
    if (!fetchUrl) { setFetchError('Enter a product URL'); return; }
    try { new URL(fetchUrl); } catch { setFetchError('Must include https://'); return; }

    setFetching(true);
    setFetchStep(1);
    try {
      await new Promise(r => setTimeout(r, 700));
      setFetchStep(2);
      const data = await fetchProductDataFromUrl(fetchUrl);
      setFetchStep(3);
      await new Promise(r => setTimeout(r, 400));
      Object.entries(data).forEach(([k, v]) => { if (v) setValue(k, v); });
    } catch (e) {
      setFetchError(e.message);
    } finally {
      setFetching(false);
      setFetchStep(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-12 overflow-y-auto">
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-gray-950/60 dark:bg-black/70"
        onPointerUp={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden my-4"
      >
        {/* Scraper overlay */}
        <AnimatePresence>
          {fetching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col items-center justify-center gap-5"
            >
              <div className="relative w-16 h-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 border-2 border-gray-100 dark:border-gray-200 border-t-orange-500 rounded-full"
                />
                <Globe size={22} className="absolute inset-0 m-auto text-orange-500" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {fetchStep === 1 && 'Connecting…'}
                  {fetchStep === 2 && 'Extracting data…'}
                  {fetchStep === 3 && 'Done!'}
                </p>
                <p className="text-xs text-gray-400 mt-1">{fetchUrl}</p>
              </div>
              <div className="w-48 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-amber-500 rounded-full"
                  animate={{ width: fetchStep === 1 ? '30%' : fetchStep === 2 ? '70%' : '100%' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {product ? 'Update the details below' : 'Fill in the product details or auto-fill from a URL'}
            </p>
          </div>
          <button onPointerUp={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-5">

          {/* Auto-scraper — show for new products */}
          {!product && (
            <div className="bg-amber-50 dark:bg-orange-900/10 border border-amber-200 dark:border-orange-800/40 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-orange-500" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-500">Auto-fill from URL</span>
                <span className="ml-auto text-[10px] bg-amber-100 dark:bg-orange-900/30 text-amber-700 dark:text-amber-500 px-2 py-0.5 rounded font-medium uppercase tracking-wide">
                  AliExpress · Amazon · Apple
                </span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    placeholder="Paste product URL…"
                    value={fetchUrl}
                    onChange={(e) => setFetchUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-200 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>
                <Button type="button" variant="accent" size="sm" onPointerUp={handleScrape} disabled={fetching} className="gap-1.5 shrink-0">
                  <RefreshCcw size={13} className={fetching ? 'animate-spin' : ''} /> Fetch
                </Button>
              </div>
              {fetchError && (
                <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {fetchError}</p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} id="product-form" className="space-y-5">

            {/* Image preview (visible when editing or after URL fill) */}
            {watchedImage && (
              <div className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-200 rounded-lg">
                <img
                  src={watchedImage}
                  alt="Product preview"
                  className="w-20 h-20 object-cover rounded-md border border-gray-100 dark:border-gray-200 shrink-0"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Image Preview</p>
                  <p className="text-xs text-gray-400 break-all line-clamp-2">{watchedImage}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Product Title" error={errors.title?.message} required>
                <Input {...register('title')} placeholder="e.g. Sony WH-1000XM5 Headphones" />
              </Field>
              <Field label="Category" error={errors.category?.message} required>
                <Input {...register('category')} placeholder="e.g. Audio" />
              </Field>
            </div>

            <Field label="Description" error={errors.description?.message} required>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Describe the product — features, use-case, highlights…"
                className={`w-full px-3 py-2.5 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none transition-colors ${
                  errors.description
                    ? 'border-red-400 focus:ring-red-400/40'
                    : 'border-gray-200 dark:border-gray-200'
                }`}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Sale Price ($)" error={errors.price?.message} required>
                <Input {...register('price')} placeholder="49.99" />
              </Field>
              <Field label="Original Price ($)" error={errors.originalPrice?.message}>
                <Input {...register('originalPrice')} placeholder="79.99 (optional)" />
              </Field>
            </div>

            <Field label="Image URL" error={errors.image?.message} required>
              <div className="relative">
                <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input {...register('image')} placeholder="https://..." className="pl-9" />
              </div>
            </Field>

            <Field label="Affiliate / Store Link" error={errors.affiliateLink?.message} required>
              <div className="space-y-1">
                <div className="relative">
                  <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input {...register('affiliateLink')} placeholder="https://aliexpress.com/item/... or Amazon/Apple link" className="pl-9" />
                </div>
                {watchedLink && (
                  <a
                    href={watchedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-500 hover:underline"
                  >
                    <ExternalLink size={11} /> Preview link
                  </a>
                )}
              </div>
            </Field>

          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-200 bg-gray-50/50 dark:bg-gray-900">
          <Button type="button" variant="ghost" size="md" onPointerUp={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="product-form"
            variant="primary"
            size="md"
            disabled={isSubmitting || fetching}
            className="gap-2 min-w-[130px]"
          >
            {isSubmitting
              ? 'Saving…'
              : product
                ? 'Save Changes'
                : 'Add Product'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductForm;
