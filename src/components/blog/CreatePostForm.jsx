import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { X, Check, Sparkles, Save, Tag as TagIcon, ChevronDown, Upload, Loader2 } from 'lucide-react';
import { push, ref as dbRef, set } from 'firebase/database';
import { useBlogStore } from '../../store/blogStore';
import { createBlogPost, updateBlogPost } from '../../services/blogService';
import { realtimeDb } from '../../firebase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { RichTextEditor } from '../editor/RichTextEditor';

/** Strip tags to measure real, human-visible content length. */
const plainTextLength = (html) => (html || '').replace(/<[^>]*>/g, '').trim().length;

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().refine((html) => plainTextLength(html) >= 20, 'Content must be at least 20 characters'),
  coverImage: z.string().min(1, 'Cover image is required'),
  coverImageRef: z.string().optional(),
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

const countWords = (text = '') =>
  text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

export default function CreatePostForm({ post, onClose }) {
  const { categories } = useBlogStore();
  const [tagDraft, setTagDraft] = React.useState('');
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');
  const fileInputRef = React.useRef(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post?.title || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      coverImage: post?.coverImage || post?.image || '',
      coverImageRef: post?.coverImageRef || '',
      category: post?.category || 'Technology',
      author: post?.author || '',
      tags: post?.tags || [],
      status: post?.status || 'draft',
    },
  });

  const titleValue = watch('title') || '';
  const excerptValue = watch('excerpt') || '';
  const selectedCover = watch('coverImage') || '';

  const uploadCoverImage = async (file) => {
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      setUploadError('Please choose a valid image file.');
      return;
    }
    const maxInputSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxInputSizeBytes) {
      setUploadError('Image is too large. Please upload a file up to 5MB.');
      return;
    }

    setIsUploadingImage(true);
    setUploadError('');
    try {
      const toDataURL = (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Failed reading image file.'));
          reader.readAsDataURL(blob);
        });

      const loadImage = (src) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('Failed loading image for processing.'));
          img.src = src;
        });

      const rawDataUrl = await toDataURL(file);
      const image = await loadImage(rawDataUrl);

      const maxWidth = 1400;
      const scale = Math.min(1, maxWidth / image.width);
      const width = Math.round(image.width * scale);
      const height = Math.round(image.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, width, height);

      const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
      const maxBase64Length = 1_200_000;
      if (optimizedDataUrl.length > maxBase64Length) {
        throw new Error('Optimized image is still too large. Please use a smaller image.');
      }

      const coverRef = push(dbRef(realtimeDb, 'blog-covers'));
      await set(coverRef, {
        dataUrl: optimizedDataUrl,
        contentType: 'image/jpeg',
        width,
        height,
        originalName: file.name,
        uploadedAt: Date.now(),
      });

      setValue('coverImage', optimizedDataUrl, { shouldValidate: true, shouldDirty: true });
      setValue('coverImageRef', coverRef.key || '', { shouldDirty: true });
    } catch (error) {
      setUploadError(error.message || 'Failed to upload cover image.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    await uploadCoverImage(file);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    await uploadCoverImage(file);
  };

  const handleTagKeyDown = (e, value, onChange) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const next = tagDraft.trim();
      if (next && !value.includes(next)) onChange([...value, next]);
      setTagDraft('');
    } else if (e.key === 'Backspace' && !tagDraft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

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
        className="relative my-4 flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
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
        <form className="grid flex-1 grid-cols-1 gap-8 overflow-y-auto p-6 sm:p-8 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            <div>
              <FieldLabel>Article Title</FieldLabel>
              <input
                {...register('title')}
                placeholder="The Future of Wearable Tech"
                className="w-full border-0 border-b border-slate-200 px-0 pb-2 text-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:border-amber-400 focus:outline-none"
              />
              <p className="mt-1 text-xs text-slate-400">
                {titleValue.length} characters
              </p>
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

            <div>
              <FieldLabel>Cover Image</FieldLabel>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition-colors hover:border-amber-400 hover:bg-amber-50/40"
              >
                {isUploadingImage ? <Loader2 size={20} className="animate-spin text-slate-500" /> : <Upload size={20} className="text-slate-500" />}
                <span className="text-sm font-medium text-slate-700">
                  {isUploadingImage ? 'Processing and saving image…' : 'Drop image here or click to upload'}
                </span>
                <span className="text-xs text-slate-400">Saved to Realtime DB `/blog-covers` as optimized base64</span>
              </button>
              {uploadError && <p className="mt-1 text-xs font-medium text-red-500">{uploadError}</p>}
              {selectedCover && (
                <img
                  src={selectedCover}
                  alt="Cover preview"
                  className="mt-2 h-24 w-full rounded-md border border-slate-200 object-cover"
                />
              )}
              {errors.coverImage && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.coverImage.message}</p>
              )}
            </div>
            <input type="hidden" {...register('coverImageRef')} />

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
              <p className="mt-1 text-xs text-slate-400">
                {countWords(excerptValue)} words • {excerptValue.length} characters
              </p>
              {errors.excerpt && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.excerpt.message}</p>
              )}
            </div>

            <div>
              <FieldLabel>Tags</FieldLabel>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/40">
                    {(field.value || []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                      >
                        <TagIcon size={11} />
                        {tag}
                        <button
                          type="button"
                          onClick={() => field.onChange(field.value.filter((t) => t !== tag))}
                          className="text-slate-400 hover:text-slate-700"
                          aria-label={`Remove ${tag}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input
                      value={tagDraft}
                      onChange={(e) => setTagDraft(e.target.value)}
                      onKeyDown={(e) => handleTagKeyDown(e, field.value || [], field.onChange)}
                      placeholder={field.value?.length ? 'Add another and press Enter' : 'Type a tag and press Enter'}
                      className="min-w-[140px] flex-1 bg-transparent px-1 py-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>
                )}
              />
            </div>
          </aside>
        </form>

        {/* Footer actions */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:px-8">
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
