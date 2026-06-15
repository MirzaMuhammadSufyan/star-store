import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ChevronLeft, Share2, Link as LinkIcon, Copy, Tag } from 'lucide-react';
import { useBlogStore } from '../store/blogStore';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = useBlogStore((state) => state.posts.find(p => p.id === id));

  if (!post) {
    return <div className="text-center py-20">Post not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <button
        onPointerUp={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors font-bold uppercase text-xs tracking-widest"
      >
        <ChevronLeft size={16} /> Back to Blog
      </button>

      <div className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-orange-500/20">
               {post.category}
             </span>
             <div className="h-[1px] flex-grow bg-gray-100 dark:bg-white/5" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black dark:text-white leading-[1.1]">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400 border-y border-gray-100 dark:border-white/5 py-6">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                   <User size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Written by</p>
                   <p className="text-gray-900 dark:text-white font-bold">{post.author}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <Calendar className="text-orange-500" size={18} />
                <span>Published on {post.date}</span>
             </div>
             <div className="flex-grow" />
             <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-orange-500 transition-colors"><Share2 size={18} /></button>
                <button className="text-gray-400 hover:text-orange-500 transition-colors"><LinkIcon size={18} /></button>
                <button className="text-gray-400 hover:text-orange-500 transition-colors"><Copy size={18} /></button>
             </div>
          </div>
        </div>

        <div className="rounded-[3rem] overflow-hidden aspect-[21/9] glass-card border-gray-100 dark:border-white/10">
           <img src={post.image} className="w-full h-full object-cover" alt="" />
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-p:text-gray-500 dark:prose-p:text-gray-400 prose-p:leading-relaxed">
          <p>{post.excerpt}</p>
          <p>{post.content}</p>
          <p>Additional detailed content for AdSense requirements. When writing articles for Google AdSense approval, it is crucial to maintain high editorial standards, provide original value, and ensure the text is sufficiently long (typically over 600-800 words). High-quality imagery with proper alt tags and a logical heading structure (H1, H2, H3) further improves compliance and SEO.</p>
          <h2>Innovation in Action</h2>
          <p>Our analysis suggests that the upcoming wave of gadget innovation will focus heavily on AI integration and sustainable energy consumption. Consumers are looking for devices that don't just solve immediate problems but also integrate seamlessly into a broader smart ecosystem while maintaining ethical manufacturing standards.</p>
          <ul>
            <li>Enhanced Battery Efficiency through AI Management</li>
            <li>Carbon-neutral manufacturing processes</li>
            <li>Universal cross-platform compatibility</li>
            <li>Advanced biometric security features</li>
          </ul>
        </div>

        <div className="pt-12 border-t border-gray-100 dark:border-white/5 flex flex-wrap gap-4">
           {['Gadgets', 'Tech', 'Innovation', 'Future'].map(tag => (
             <span key={tag} className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl text-xs font-bold dark:text-white border border-gray-100 dark:border-white/10 hover:border-orange-500/30 transition-colors cursor-pointer flex items-center gap-2">
               <Tag size={12} className="text-orange-500" /> {tag}
             </span>
           ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
