import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, FileText } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useBlogStore } from '../store/blogStore';
import { getPublishedPosts, resolveBlogImage, estimateReadingTime } from '../utils/blogUtils';
import SEO from '../components/SEO';

export default function BlogArchive() {
  const { posts, categories, loading } = useBlogStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const tagFilter = searchParams.get('tag') || '';
  const [selected, setSelected] = React.useState('All');

  const published = React.useMemo(() => getPublishedPosts(posts), [posts]);

  const filtered = React.useMemo(() => {
    let list = published;
    if (selected !== 'All') list = list.filter((p) => p.category === selected);
    if (tagFilter) {
      const tag = tagFilter.toLowerCase();
      list = list.filter((p) => (p.tags || []).some((t) => t.toLowerCase() === tag));
    }
    return list;
  }, [published, selected, tagFilter]);

  const [hero, ...rest] = filtered;

  const clearTag = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('tag');
    setSearchParams(next, { replace: true });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-amber-500" />
        <p className="text-sm text-gray-500">Loading articles…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <SEO
        title={tagFilter ? `Articles tagged “${tagFilter}”` : 'The Journal'}
        description="In-depth reviews, buying guides, and tech stories from Star Store — for people who care about what they buy."
        url={tagFilter ? `/blog?tag=${encodeURIComponent(tagFilter)}` : '/blog'}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Compact masthead */}
        <header className="mb-6 flex flex-col gap-3 border-b border-stone-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
              Star Store Editorial
            </p>
            <h1
              className="mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              The Journal
            </h1>
            <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-stone-600">
              Reviews, buying guides, and tech stories — written for careful shoppers.
            </p>
          </div>
          <p className="shrink-0 text-xs text-stone-500">
            {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
          </p>
        </header>

        {tagFilter && (
          <div className="mb-4 flex items-center gap-2 text-sm text-stone-600">
            <span>
              Tag: <strong className="text-stone-800">{tagFilter}</strong>
            </span>
            <button
              type="button"
              onClick={clearTag}
              className="text-xs font-semibold text-amber-700 hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* Category filters — compact text tabs, not fat pills */}
        <nav className="mb-7 flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelected(cat)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors ${
                selected === cat
                  ? 'bg-stone-900 font-medium text-white'
                  : 'text-stone-600 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Featured — horizontal, controlled height */}
        {hero && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8"
          >
            <Link
              to={`/blog/${hero.id}`}
              className="group grid overflow-hidden rounded-lg border border-stone-200 bg-white shadow-card transition-all hover:border-amber-300 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]"
            >
              <div className="aspect-[16/10] overflow-hidden bg-stone-100 md:aspect-auto md:min-h-[220px] md:max-h-[260px]">
                <img
                  src={resolveBlogImage(hero)}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col justify-center gap-2.5 p-5 sm:p-6">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700">
                  Featured · {hero.category}
                </span>
                <h2
                  className="text-xl font-semibold leading-snug text-stone-900 transition-colors group-hover:text-amber-800 sm:text-2xl"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {hero.title}
                </h2>
                <p className="line-clamp-2 text-sm leading-relaxed text-stone-600">
                  {hero.excerpt}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                  <span>{hero.author}</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={11} /> {hero.date}
                  </span>
                  <span>{estimateReadingTime(hero.content)} min read</span>
                  <span className="ml-auto inline-flex items-center gap-0.5 font-medium text-amber-700">
                    Read <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Article grid — denser, quieter cards */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {rest.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: Math.min(i * 0.04, 0.24), duration: 0.3 }}
              >
                <Link
                  to={`/blog/${post.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-card transition-all hover:border-amber-300 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-stone-100">
                    <img
                      src={resolveBlogImage(post)}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700">
                      {post.category}
                    </span>
                    <h3
                      className="mt-1.5 line-clamp-2 text-[15px] font-semibold leading-snug text-stone-900 transition-colors group-hover:text-amber-800"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {post.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 flex-1 text-[13px] leading-relaxed text-stone-600">
                      {post.excerpt}
                    </p>
                    <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2.5 text-[11px] text-stone-500">
                      <span className="truncate pr-2">
                        {post.date} · {estimateReadingTime(post.content)} min
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-0.5 font-medium text-amber-700">
                        Read <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-stone-400">
            <FileText size={28} strokeWidth={1.5} className="mb-2 text-stone-300" />
            <p className="text-sm">
              {tagFilter
                ? `No published articles tagged “${tagFilter}”.`
                : 'No articles in this category yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
