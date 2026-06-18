import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { X, Check, Image as ImageIcon } from 'lucide-react';
import { useBlogStore } from '../store/blogStore';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  image: z.string().url('Invalid image URL'),
  category: z.string().min(2, 'Category is required'),
  author: z.string().min(2, 'Author is required'),
  date: z.string().min(2, 'Date is required'),
});

const BlogForm = ({ post, onClose }) => {
  const { addPost, updatePost, categories } = useBlogStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: post || {
      title: '',
      excerpt: '',
      content: '',
      image: '',
      category: 'Technology',
      author: 'Admin',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }
  });

  const onSubmit = async (data) => {
    if (post) {
      await updatePost(post.id, data);
    } else {
      await addPost(data);
    }
    onClose();
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
        <div className="px-8 py-6 flex items-center justify-between border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
          <div>
            <h2 className="text-2xl font-black dark:text-white">
              {post ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
            <p className="text-xs text-gray-400 font-medium">Share your tech insights with the world</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-orange-500/10 hover:text-orange-500 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Blog Title"
              {...register('title')}
              placeholder="Ex: The Future of AI in 2025"
              error={errors.title?.message}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block ml-1">Category</label>
                    <select
                        {...register('category')}
                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                        {categories.filter(c => c !== 'All').map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <Input
                    label="Author Name"
                    {...register('author')}
                    error={errors.author?.message}
                />
            </div>

            <Input
                label="Feature Image URL"
                {...register('image')}
                placeholder="https://images.unsplash..."
                error={errors.image?.message}
            />

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 block ml-1">Excerpt</label>
              <textarea
                {...register('excerpt')}
                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 h-20 resize-none"
                placeholder="A short summary for the post card..."
              />
              {errors.excerpt && <p className="text-xs text-red-500 font-medium ml-1">{errors.excerpt.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 block ml-1">Content</label>
              <textarea
                {...register('content')}
                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 h-60 resize-none"
                placeholder="Write your blog post content here..."
              />
              {errors.content && <p className="text-xs text-red-500 font-medium ml-1">{errors.content.message}</p>}
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="button" variant="glass" className="flex-grow py-4" onClick={onClose}>Discard</Button>
              <Button type="submit" className="flex-grow py-4" disabled={isSubmitting}>
                {post ? <>Update Post <Check size={18} className="ml-2" /></> : <>Publish Post <Check size={18} className="ml-2" /></>}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogForm;
