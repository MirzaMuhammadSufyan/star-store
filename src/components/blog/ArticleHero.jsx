import React from 'react';
import { Calendar, ChevronLeft, Clock, Share2, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { estimateReadingTime, resolveBlogImage } from '../../utils/blogUtils';
import { resolveAuthor } from '../../content/authors';

export function ArticleHero({ post, onBack }) {
  const minutes = estimateReadingTime(post.content);
  const coverImage = resolveBlogImage(post);
  const author = resolveAuthor(post);

  return (
    <>
      <div className="border-b border-slate-200 py-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
        >
          <ChevronLeft size={16} /> Back to Journal
        </button>
      </div>

      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-[720px] space-y-5 py-12 sm:py-16"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
          {post.category}
        </span>
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
          {post.title}
        </h1>
        <p className="text-lg leading-relaxed text-slate-500">{post.excerpt}</p>
        <div className="flex flex-wrap items-center gap-5 border-t border-slate-200 pt-4 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <User size={14} />
            <span className="text-slate-600 font-medium">{author.name}</span>
            {author.role ? <span className="text-slate-400">· {author.role}</span> : null}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} /> {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> {minutes} min read
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied!');
            }}
            className="ml-auto flex items-center gap-1.5 transition-colors hover:text-slate-700"
          >
            <Share2 size={14} /> Share
          </button>
        </div>
      </motion.header>

      <div className="mx-auto mb-12 aspect-[21/9] w-full max-w-5xl overflow-hidden rounded-2xl">
        {coverImage ? (
          <img
            src={coverImage}
            alt={post.title}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-400">
            No cover image
          </div>
        )}
      </div>
    </>
  );
}
