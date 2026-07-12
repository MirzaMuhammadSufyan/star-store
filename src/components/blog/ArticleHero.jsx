import React from 'react';
import { Calendar, ChevronLeft, Clock, Share2, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { estimateReadingTime, resolveBlogImage } from '../../utils/blogUtils';
import { resolveAuthor } from '../../content/authors';

export function ArticleHero({ post, onBack }) {
  const minutes = estimateReadingTime(post.content);
  const coverImage = resolveBlogImage(post);
  const author = resolveAuthor(post);

  return (
    <div>
      <div className="pt-5 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[13px] text-stone-500 transition-colors hover:text-stone-900"
        >
          <ChevronLeft size={14} /> Journal
        </button>
      </div>

      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-3 pb-6"
      >
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-700">
          <Link to="/blog" className="hover:underline">
            {post.category}
          </Link>
        </div>

        <h1
          className="article-prose text-[1.65rem] font-bold leading-[1.25] text-stone-900 sm:text-[1.85rem]"
        >
          {post.title}
        </h1>

        {post.excerpt ? (
          <p className="article-prose text-[0.95rem] leading-relaxed text-stone-600">
            {post.excerpt}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-stone-200 pt-3 text-[12px] text-stone-500">
          <span className="inline-flex items-center gap-1.5">
            <User size={12} />
            <span className="font-medium text-stone-700">{author.name}</span>
            {author.role ? <span>· {author.role}</span> : null}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} /> {post.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {minutes} min
          </span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href).catch(() => {});
            }}
            className="ml-auto inline-flex items-center gap-1 transition-colors hover:text-stone-800"
            aria-label="Copy link to article"
          >
            <Share2 size={12} /> Share
          </button>
        </div>
      </motion.header>

      <div className="mb-8 aspect-[16/9] overflow-hidden rounded-lg bg-stone-100 sm:mb-10">
        {coverImage ? (
          <img
            src={coverImage}
            alt={post.title}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
            No cover image
          </div>
        )}
      </div>
    </div>
  );
}
