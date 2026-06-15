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
        <h1 className="text-5xl md:text-7xl font-black dark:text-white leading-tight">Insightful Content for <span className="text-orange-500">Tech Enthusiasts</span></h1>
        <p className="text-xl text-gray-500 dark:text-gray-400">Deep dives into the latest gadgets, trends, and innovation that shape our digital world.</p>
      </section>

      {/* Filter */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {categories.map(cat => (
          <button
            key={cat}
            onPointerUp={() => setSelectedCategory(cat)}
            className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white border-orange-500 shadow-xl shadow-orange-500/20'
                : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/10 hover:border-orange-500/30'
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
            <Link to={`/blog/${post.id}`} className="block relative aspect-[16/10] overflow-hidden rounded-[3rem] glass-card border-gray-100 dark:border-white/10">
              <img
                src={post.image}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt=""
              />
              <div className="absolute top-6 left-6">
                 <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest dark:text-white flex items-center gap-2 shadow-lg">
                   <Tag size={10} className="text-orange-500" /> {post.category}
                 </span>
              </div>
            </Link>

            <div className="space-y-4">
              <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-2"><Calendar size={14} className="text-orange-500" /> {post.date}</span>
                <span className="flex items-center gap-2"><User size={14} className="text-orange-500" /> {post.author}</span>
              </div>
              <h2 className="text-3xl font-black dark:text-white leading-tight group-hover:text-orange-500 transition-colors">
                <Link to={`/blog/${post.id}`}>{post.title}</Link>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed font-medium">
                {post.excerpt}
              </p>
              <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-orange-500 font-black uppercase text-[10px] tracking-widest group/btn">
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
