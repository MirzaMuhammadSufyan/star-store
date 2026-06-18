import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, RefreshCcw, Link as LinkIcon, Globe, Check, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { fetchProductDataFromUrl } from '../utils/parser';

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  image: z.string().url('Invalid main image URL'),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  category: z.string().min(2, 'Category is required'),
  tags: z.string().optional(),
  affiliateLink: z.string().url('Invalid affiliate URL'),
});

const ProductForm = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useProductStore();
  const [isFetching, setIsFetching] = useState(false);
  const [fetchUrl, setFetchUrl] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [showScraperUI, setShowScraperUI] = useState(false);
  const [scraperStep, setScraperStep] = useState(0);

  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: product ? { ...product, tags: product.tags?.join(', ') || '' } : {
      title: '',
      description: '',
      price: '',
      image: '',
      images: [''],
      category: '',
      tags: '',
      affiliateLink: '',
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images"
  });

  const onSubmit = async (data) => {
    const formattedData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : []
    };

    if (product) {
      await updateProduct(product.id, formattedData);
    } else {
      await addProduct(formattedData);
    }
    onClose();
  };

  const handleRealScraping = async () => {
    if (!fetchUrl) {
      setFetchError('Please enter a valid store URL');
      return;
    }

    setFetchError('');
    setIsFetching(true);
    
    try {
      new URL(fetchUrl);
    } catch (e) {
      setFetchError('Please enter a valid URL (including https://)');
      setIsFetching(false);
      return;
    }

    setShowScraperUI(true);
    setScraperStep(1);

    try {
      await new Promise(r => setTimeout(r, 800));
      setScraperStep(2);
      
      const extractedData = await fetchProductDataFromUrl(fetchUrl);
      
      setScraperStep(3);
      await new Promise(r => setTimeout(r, 600));

      Object.keys(extractedData).forEach(key => {
        if (extractedData[key]) {
          setValue(key, extractedData[key]);
        }
      });
      
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsFetching(false);
      setShowScraperUI(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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
            onClick={onClose}
            className="p-2 hover:bg-orange-500/10 hover:text-orange-500 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8">
          <AnimatePresence>
            {showScraperUI && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-4 z-50 bg-white dark:bg-[#0a0a0c] rounded-3xl border border-orange-500/30 shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="bg-gray-100 dark:bg-white/5 p-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5 ml-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="flex-grow bg-white dark:bg-black/20 rounded-lg px-4 py-1 text-[10px] text-gray-500 truncate mx-4 border border-white/5">
                    {fetchUrl}
                  </div>
                </div>
                
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-8 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.05)_0%,transparent_70%)]">
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 border-t-2 border-orange-500 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Globe className="text-orange-500 animate-pulse" size={28} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">
                      {scraperStep === 1 && "Initializing Sandbox..."}
                      {scraperStep === 2 && "Extracting Live Data..."}
                      {scraperStep === 3 && "Verified & Synced"}
                    </h3>
                  </div>

                  <div className="w-48 h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: scraperStep === 1 ? '30%' : scraperStep === 2 ? '70%' : '100%' }}
                      className="h-full bg-orange-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!product && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <div className="relative p-6 bg-white dark:bg-white/5 border border-orange-500/20 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-orange-500 font-black text-sm uppercase tracking-widest">
                    <Sparkles size={18} />
                    <span>Instant Link Scraper</span>
                  </div>
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
                    onClick={handleRealScraping}
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <Input 
                label="Product Title"
                {...register('title')}
                placeholder="Ex: iPhone 15 Pro Max"
                error={errors.title?.message}
              />
              <Input 
                label="Category"
                {...register('category')}
                placeholder="Ex: Smartphones"
                error={errors.category?.message}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <Input 
                label="Listing Price ($)"
                {...register('price')}
                placeholder="999.00"
                error={errors.price?.message}
              />
              <Input 
                label="Main Showcase Image"
                {...register('image')}
                placeholder="https://images.unsplash..."
                error={errors.image?.message}
              />
            </div>

            <Input
              label="Tags (comma separated)"
              {...register('tags')}
              placeholder="Ex: Gaming, RGB, Wireless"
              error={errors.tags?.message}
            />

            {/* Multiple Images Array */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block ml-1">
                        Gallery Images
                    </label>
                    <button
                        type="button"
                        onClick={() => append('')}
                        className="text-orange-500 hover:text-orange-600 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
                    >
                        <Plus size={14} /> Add Image
                    </button>
                </div>
                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                            <Input
                                {...register(`images.${index}`)}
                                placeholder="Image URL"
                                error={errors.images?.[index]?.message}
                                className="flex-grow"
                            />
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500/20 transition-colors h-[54px] mt-1"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {errors.images?.message && <p className="text-xs text-red-500 font-medium ml-1">{errors.images.message}</p>}
                </div>
            </div>

            <Input 
              label="Original Store / Affiliate Link"
              {...register('affiliateLink')}
              placeholder="https://www.amazon.com/dp/..."
              error={errors.affiliateLink?.message}
            />

            <div className="flex gap-4 pt-6">
              <Button 
                type="button" 
                variant="glass" 
                className="flex-grow py-4 border-gray-200 dark:border-white/10 dark:text-white font-bold uppercase text-xs tracking-widest"
                onClick={onClose}
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
