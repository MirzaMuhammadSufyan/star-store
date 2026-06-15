import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { X, Sparkles, RefreshCcw, Link as LinkIcon } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Skeleton } from './ui/Skeleton';
import { fetchProductDataFromUrl } from '../utils/parser';

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

  const handleAutoFetch = async () => {
    if (!fetchUrl) {
      setFetchError('Please enter a URL first');
      return;
    }

    setFetchError('');
    setIsFetching(true);
    try {
      const data = await fetchProductDataFromUrl(fetchUrl);
      Object.keys(data).forEach(key => {
        setValue(key, data[key]);
      });
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onPointerUp={onClose}
        className="absolute inset-0 bg-premium-dark/80 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 glass-morphism px-6 py-4 flex items-center justify-between border-b border-white/10">
          <h2 className="text-xl font-bold text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onPointerUp={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Auto-Fetch Section */}
          {!product && (
            <div className="p-4 bg-premium-purple/5 border border-premium-purple/20 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-premium-purple font-semibold text-sm">
                <Sparkles size={16} />
                <span>Auto-Fetch Product Data</span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    type="text"
                    placeholder="Paste Amazon product URL..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-premium-purple/50"
                    value={fetchUrl}
                    onChange={(e) => setFetchUrl(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  onPointerUp={handleAutoFetch}
                  disabled={isFetching}
                  className="whitespace-nowrap gap-2"
                >
                  {isFetching ? <RefreshCcw size={16} className="animate-spin" /> : 'Fetch Data'}
                </Button>
              </div>
              {fetchError && <p className="text-xs text-red-500">{fetchError}</p>}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {isFetching ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
                <Skeleton className="h-28 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Product Title"
                    {...register('title')}
                    placeholder="e.g. Sony WH-1000XM4"
                    error={errors.title?.message}
                  />
                  <Input
                    label="Category"
                    {...register('category')}
                    placeholder="e.g. Electronics"
                    error={errors.category?.message}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 block ml-1">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    className={`w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-3.5 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-premium-purple/50 transition-all duration-300 resize-none h-32 ${errors.description ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
                    placeholder="Detailed product description..."
                  ></textarea>
                  {errors.description && <p className="text-xs text-red-500 font-medium ml-1">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Price ($)"
                    {...register('price')}
                    placeholder="348.00"
                    error={errors.price?.message}
                  />
                  <Input
                    label="Image URL"
                    {...register('image')}
                    placeholder="https://..."
                    error={errors.image?.message}
                  />
                </div>

                <Input
                  label="Affiliate/Product Link"
                  {...register('affiliateLink')}
                  placeholder="https://amazon.com/..."
                  error={errors.affiliateLink?.message}
                />
              </>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="glass"
                className="flex-grow"
                onPointerUp={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-grow"
                disabled={isSubmitting || isFetching}
              >
                {product ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductForm;
