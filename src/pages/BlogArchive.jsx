import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogStore } from '../store/blogStore';

const BlogArchive = () => {
  const { posts, categories } = useBlogStore();
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredPosts = posts.filter(post =>
    selectedCategory === 'All' || post.category === selectedCategory
  );

  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-5xl md:text-6xl font-black dark:text-white leading-tight">Insightful Content for <span className="text-premium-purple">Tech Enthusiasts</span></h1>
        <p className="text-xl text-gray-500 dark:text-gray-400">Deep dives into the latest gadgets, trends, and innovation that shape our digital world.</p>
      </section>

      {/* Filter */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {categories.map(cat => (
          <button
            key={cat}
            onPointerUp={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
              selectedCategory === cat
                ? 'bg-premium-purple text-white border-premium-purple shadow-lg shadow-premium-purple/20'
                : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/10 hover:border-premium-purple/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredPosts.map((post, i) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group flex flex-col space-y-6"
          >
            <Link to={`/blog/${post.id}`} className="block relative aspect-[16/10] overflow-hidden rounded-[2rem] glass-card border-gray-100 dark:border-white/10">
              <img
                src={post.image}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt=""
              />
              <div className="absolute top-4 left-4">
                 <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest dark:text-white flex items-center gap-1">
                   <Tag size={10} className="text-premium-purple" /> {post.category}
                 </span>
              </div>
            </Link>

            <div className="space-y-4">
              <div className="flex items-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-2"><Calendar size={14} className="text-premium-purple" /> {post.date}</span>
                <span className="flex items-center gap-2"><User size={14} className="text-premium-purple" /> {post.author}</span>
              </div>
              <h2 className="text-2xl font-bold dark:text-white leading-tight group-hover:text-premium-purple transition-colors">
                <Link to={`/blog/${post.id}`}>{post.title}</Link>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-premium-purple font-black uppercase text-xs tracking-widest group/btn">
                Read Full Article <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-2" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default BlogArchive;
