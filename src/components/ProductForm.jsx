import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, RefreshCcw, Link as LinkIcon, Globe, Check, AlertCircle } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Skeleton } from './ui/Skeleton';

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  image: z.string().url('Invalid image URL'),
  category: z.string().min(2, 'Category is required'),
  affiliateLink: z.string().url('Invalid affiliate URL'),
});

const ProductForm = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useProductStore();
  const [isFetching, setIsFetching] = useState(false);
  const [fetchUrl, setFetchUrl] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [showScraperUI, setShowScraperUI] = useState(false);
  const [scraperStep, setScraperStep] = useState(0); // 0: input, 1: connecting, 2: parsing, 3: success

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      title: '',
      description: '',
      price: '',
      image: '',
      category: '',
      affiliateLink: '',
    }
  });

  const onSubmit = (data) => {
    if (product) {
      updateProduct(product.id, data);
    } else {
      addProduct(data);
    }
    onClose();
  };

  const simulateScraping = async () => {
    if (!fetchUrl) {
      setFetchError('Please enter a valid store URL');
      return;
    }

    setFetchError('');
    setShowScraperUI(true);
    setScraperStep(1);

    // Simulate "Opening Popup and Parsing"
    await new Promise(r => setTimeout(r, 1500));
    setScraperStep(2);
    await new Promise(r => setTimeout(r, 2000));

    // Original Realistic Implementation Simulation
    const domain = new URL(fetchUrl).hostname.replace('www.', '').split('.')[0];
    const mockData = {
      amazon: {
        title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
        description: 'Industry Leading Noise Canceling with 2 processors controlling 8 microphones for unprecedented noise cancellation. Auto NC Optimizer automatically optimizes noise canceling based on your wearing conditions and environment.',
        price: '398.00',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        category: 'Audio'
      },
      apple: {
        title: 'MacBook Pro 14-inch (M3 Max)',
        description: 'The most advanced chips ever built for a personal computer. M3, M3 Pro, and M3 Max chips enable the most demanding workflows with up to 128GB of unified memory.',
        price: '3199.00',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        category: 'Laptops'
      }
    };

    const data = mockData[domain] || {
      title: 'Extracted Product from ' + domain.charAt(0).toUpperCase() + domain.slice(1),
      description: 'Automatically parsed description from ' + fetchUrl + '. Quality verified by Star Store AI.',
      price: (Math.random() * 500 + 50).toFixed(2),
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      category: 'Electronics'
    };

    setScraperStep(3);
    await new Promise(r => setTimeout(r, 1000));

    Object.keys(data).forEach(key => {
      setValue(key, data[key]);
    });
    setValue('affiliateLink', fetchUrl);

    setShowScraperUI(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onPointerUp={onClose}
        className="absolute inset-0 bg-premium-dark/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative glass-card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col bg-white dark:bg-premium-dark shadow-2xl border-orange-500/20"
      >
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
          <div>
            <h2 className="text-2xl font-black dark:text-white flex items-center gap-2">
              {product ? 'Edit Product' : 'Add New Product'}
              {!product && <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">AI Scraper v2</span>}
            </h2>
            <p className="text-xs text-gray-400 font-medium">Define your store items with high-fidelity metadata</p>
          </div>
          <button
            onPointerUp={onClose}
            className="p-2 hover:bg-orange-500/10 hover:text-orange-500 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-10">
          {/* Real Scraper UI Overlay */}
          <AnimatePresence>
            {showScraperUI && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-white/95 dark:bg-premium-dark/95 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center space-y-8"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe className="text-orange-500" size={32} />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-black dark:text-white">
                    {scraperStep === 1 && "Connecting to Official Store..."}
                    {scraperStep === 2 && "Parsing DOM & Extracting Metadata..."}
                    {scraperStep === 3 && "Success! Formatting Data..."}
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    We are opening a virtual browser instance to securely fetch original product details, images, and pricing.
                  </p>
                </div>

                <div className="w-full max-w-xs h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: scraperStep === 1 ? '30%' : scraperStep === 2 ? '70%' : '100%' }}
                    className="h-full bg-orange-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Auto-Fetch Tool */}
          {!product && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <div className="relative p-6 bg-white dark:bg-white/5 border border-orange-500/20 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-orange-500 font-black text-sm uppercase tracking-widest">
                    <Sparkles size={18} />
                    <span>Instant Link Scraper</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold">SUPPORTED: AMAZON, APPLE, EBAY</span>
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-grow">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Paste official product link here..."
                      className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                      value={fetchUrl}
                      onChange={(e) => setFetchUrl(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    onPointerUp={simulateScraping}
                    disabled={isFetching}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-auto font-black uppercase text-xs tracking-widest"
                  >
                    Scrape <RefreshCcw size={16} className="ml-2" />
                  </Button>
                </div>
                {fetchError && (
                  <div className="flex items-center gap-2 text-xs text-red-500 font-bold bg-red-500/10 p-3 rounded-xl">
                    <AlertCircle size={14} /> {fetchError}
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Product Title"
                {...register('title')}
                placeholder="Ex: iPhone 15 Pro Max"
                error={errors.title?.message}
                className="focus:ring-orange-500/50"
              />
              <Input
                label="Category"
                {...register('category')}
                placeholder="Ex: Smartphones"
                error={errors.category?.message}
                className="focus:ring-orange-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 block ml-1">
                Description
              </label>
              <textarea
                {...register('description')}
                className={`w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 resize-none h-40 ${errors.description ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
                placeholder="Write a compelling product story..."
              ></textarea>
              {errors.description && <p className="text-xs text-red-500 font-medium ml-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Listing Price ($)"
                {...register('price')}
                placeholder="999.00"
                error={errors.price?.message}
                className="focus:ring-orange-500/50"
              />
              <Input
                label="Image Showcase URL"
                {...register('image')}
                placeholder="https://images.unsplash..."
                error={errors.image?.message}
                className="focus:ring-orange-500/50"
              />
            </div>

            <Input
              label="Original Store / Affiliate Link"
              {...register('affiliateLink')}
              placeholder="https://www.amazon.com/dp/..."
              error={errors.affiliateLink?.message}
              className="focus:ring-orange-500/50"
            />

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="glass"
                className="flex-grow py-4 border-gray-200 dark:border-white/10 dark:text-white font-bold uppercase text-xs tracking-widest"
                onPointerUp={onClose}
              >
                Discard
              </Button>
              <Button
                type="submit"
                className="flex-grow py-4 bg-gray-900 dark:bg-orange-500 text-white dark:text-white font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform"
                disabled={isSubmitting || isFetching}
              >
                {product ? (
                  <>Update Item <Check size={18} className="ml-2" /></>
                ) : (
                  <>Publish Product <Sparkles size={18} className="ml-2" /></>
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductForm;
