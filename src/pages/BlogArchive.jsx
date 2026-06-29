import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogStore } from '../store/blogStore';

export default function BlogArchive() {
  const { posts, categories, loading } = useBlogStore();
  const [selected, setSelected] = React.useState('All');

  const filtered = posts.filter(p => selected === 'All' || p.category === selected);
  const [hero, ...rest] = filtered;

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="w-7 h-7 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Loading articles…</p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* Header */}
        <div className="pb-8 border-b border-gray-200">
          <p className="text-xs text-amber-700 uppercase tracking-widest font-semibold mb-2">Star Store Editorial</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Journal
          </h1>
          <p className="mt-3 text-gray-600 text-base max-w-xl">
            In-depth reviews, buying guides, and tech stories — for people who care about what they buy.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${
                selected === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Hero article */}
        {hero && (
          <motion.article
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="group grid md:grid-cols-2 bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
          >
            <Link to={`/blog/${hero.id}`} className="block overflow-hidden aspect-[4/3] md:aspect-auto">
              <img src={hero.image} alt={hero.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </Link>
            <div className="p-8 md:p-10 flex flex-col justify-center gap-4">
              <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold">Featured · {hero.category}</span>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                <Link to={`/blog/${hero.id}`} className="hover:text-amber-700 transition-colors">{hero.title}</Link>
              </h2>
              <p className="text-gray-500 leading-relaxed line-clamp-3">{hero.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5"><User size={12} /> {hero.author}</span>
                <span className="flex items-center gap-1.5"><Calendar size={12} /> {hero.date}</span>
              </div>
              <Link to={`/blog/${hero.id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-amber-700 transition-colors">
                Read Article <ArrowRight size={14} />
              </Link>
            </div>
          </motion.article>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <Link to={`/blog/${post.id}`} className="block overflow-hidden aspect-[16/10]">
                  <img src={post.image} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold">{post.category}</span>
                  <h3 className="mt-2 text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-700 transition-colors flex-grow" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <span>{post.author} · {post.date}</span>
                    <Link to={`/blog/${post.id}`} className="flex items-center gap-1 text-amber-700 font-medium hover:underline">
                      Read <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-20 text-sm">No articles in this category yet.</p>
        )}
      </div>
    </div>
  );
}
