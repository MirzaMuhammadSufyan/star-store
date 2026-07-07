import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { X, Check, Sparkles, Save, Tag as TagIcon, ChevronDown } from 'lucide-react';
import { useBlogStore } from '../../store/blogStore';
import { createBlogPost, updateBlogPost } from '../../services/blogService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { RichTextEditor } from '../editor/RichTextEditor';

/** Strip tags to measure real, human-visible content length. */
const plainTextLength = (html) => (html || '').replace(/<[^>]*>/g, '').trim().length;

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().refine((html) => plainTextLength(html) >= 20, 'Content must be at least 20 characters'),
  coverImage: z.string().url('Enter a valid image URL'),
  category: z.string().min(2, 'Category is required'),
  author: z.string().min(2, 'Author name is required'),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
});

const FieldLabel = ({ children }) => (
  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-500">
    {children}
  </label>
);

/** Chip-based tags editor. Adds on Enter/comma, removes on click or Backspace. */
function TagInput({ value = [], onChange }) {
  const [draft, setDraft] = React.useState('');

  const commit = () => {
    const next = draft.trim().replace(/,$/, '');
    if (next && !value.includes(next)) onChange([...value, next]);
    setDraft('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/40">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
        >
          <TagIcon size={11} />
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="text-slate-400 hover:text-slate-700"
            aria-label={`Remove ${tag}`}
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={value.length ? 'Add another…' : 'Add a tag and press Enter'}
        className="min-w-[120px] flex-1 bg-transparent px-1 py-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
      />
    </div>
  );
}

export default function CreatePostForm({ post, onClose }) {
  const { categories } = useBlogStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post?.title || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      coverImage: post?.coverImage || post?.image || '',
      category: post?.category || 'Technology',
      author: post?.author || '',
      tags: post?.tags || [],
      status: post?.status || 'draft',
    },
  });

  const submit = (status) =>
    handleSubmit(async (data) => {
      const payload = { ...data, status };
      if (post) {
        await updateBlogPost(post.id, { ...payload, publishedAt: post.publishedAt });
      } else {
        await createBlogPost(payload);
      }
      onClose();
    });

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        className="relative my-4 flex w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-6 py-4 sm:px-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {post ? 'Edit Article' : 'Create New Article'}
            </h2>
            <p className="text-xs font-medium text-slate-400">
              Craft a rich, formatted story for your readers
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body: main editor column + meta sidebar */}
        <form className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            <div>
              <FieldLabel>Article Title</FieldLabel>
              <input
                {...register('title')}
                placeholder="The Future of Wearable Tech"
                className="w-full border-0 border-b border-slate-200 px-0 pb-2 text-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:border-amber-400 focus:outline-none"
              />
              {errors.title && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <FieldLabel>Content</FieldLabel>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Start writing your article…"
                  />
                )}
              />
              {errors.content && (
                <p className="mt-1.5 text-xs font-medium text-red-500">{errors.content.message}</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:border-l lg:border-slate-100 lg:pl-8">
            <div>
              <FieldLabel>Status</FieldLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
                    {['draft', 'published'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => field.onChange(s)}
                        className={`rounded-md py-1.5 text-xs font-semibold capitalize transition-colors ${
                          field.value === s
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>

            <Input
              label="Cover Image URL"
              {...register('coverImage')}
              placeholder="https://images.unsplash.com/…"
              error={errors.coverImage?.message}
            />

            <div>
              <FieldLabel>Category</FieldLabel>
              <div className="relative">
                <select
                  {...register('category')}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 text-[15px] text-gray-900 transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                >
                  {categories
                    .filter((c) => c !== 'All')
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            <Input
              label="Author"
              {...register('author')}
              placeholder="Jane Doe"
              error={errors.author?.message}
            />

            <div>
              <FieldLabel>Excerpt</FieldLabel>
              <textarea
                {...register('excerpt')}
                rows={3}
                placeholder="A short summary shown on the archive page…"
                className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
              {errors.excerpt && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.excerpt.message}</p>
              )}
            </div>

            <div>
              <FieldLabel>Tags</FieldLabel>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => <TagInput value={field.value} onChange={field.onChange} />}
              />
            </div>
          </aside>
        </form>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4 sm:px-8">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={submit('draft')}
            disabled={isSubmitting}
            className="gap-1.5"
          >
            <Save size={16} /> Save Draft
          </Button>
          <Button
            type="button"
            variant="accent"
            onClick={submit('published')}
            disabled={isSubmitting}
            className="gap-1.5"
          >
            {post ? <Check size={16} /> : <Sparkles size={16} />}
            {post ? 'Update & Publish' : 'Publish'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
