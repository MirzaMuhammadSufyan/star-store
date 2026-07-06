import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ChevronLeft, Share2, Tag, ArrowRight, ExternalLink } from 'lucide-react';
import { useBlogStore } from '../store/blogStore';
import { useProductStore } from '../store/productStore';
import { Button } from '../components/ui/Button';

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = useBlogStore((s) => s.posts.find((p) => p.id === id));
  const { products } = useProductStore();

  // Prefer products whose category loosely matches this article's category —
  // falls back to a generic slice so "Shop the Story" never renders empty.
  const related = React.useMemo(() => {
    if (!post) return [];
    const cat = (post.category || '').toLowerCase();
    const matched = cat
      ? products.filter((p) => {
          const pCat = (p.second_level_category_name || p.category || p.merchant || '').toLowerCase();
          return pCat.includes(cat) || cat.includes(pCat);
        })
      : [];
    return (matched.length > 0 ? matched : products).slice(0, 3);
  }, [products, post]);

  if (!post) return (
    <div className="text-center py-32">
      <p className="text-gray-400">Article not found.</p>
      <Link to="/blog" className="mt-4 inline-block text-sm text-amber-700 hover:underline">← Back to Journal</Link>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <div className="py-5 border-b border-gray-200">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ChevronLeft size={16} /> Back to Journal
          </button>
        </div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl mx-auto py-12 space-y-4"
        >
          <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold">{post.category}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {post.title}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400 pt-3 border-t border-gray-200">
            <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }}
              className="flex items-center gap-1.5 hover:text-gray-700 transition-colors ml-auto">
              <Share2 size={14} /> Share
            </button>
          </div>
        </motion.header>

        {/* Hero image */}
        <div className="w-full aspect-[21/9] overflow-hidden rounded-xl mb-12">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Body */}
        <article className="max-w-2xl mx-auto mb-20 space-y-5 text-[16px] leading-[1.85] text-gray-600">
          <p>{post.content}</p>
          <p>Our editors spend time with each product — testing real-world performance, battery life, and build quality — so you can make confident purchasing decisions without wasting money.</p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            What Sets This Apart
          </h2>
          <p>The best consumer technology right now focuses on integration — devices that work together, conserve energy, and fit into daily life without friction.</p>

          <ul className="list-disc list-inside space-y-2 text-gray-600 pl-2">
            <li>AI-enhanced battery management</li>
            <li>Sustainable manufacturing without compromising specs</li>
            <li>Seamless cross-platform compatibility</li>
            <li>Privacy-first biometric features</li>
          </ul>

          {post.category && (
            <p>
              Ready to see this in action? Browse our full, hand-picked{' '}
              <Link to={`/catalog?cat=${encodeURIComponent(post.category)}`} className="text-amber-700 font-medium hover:underline">
                {post.category} collection
              </Link>{' '}
              for verified deals from official stores.
            </p>
          )}

          {/* Tags */}
          <div className="pt-10 mt-10 border-t border-gray-200 flex flex-wrap gap-2">
            {['Gadgets', 'Tech', 'Innovation', 'Review'].map(tag => (
              <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded text-xs text-gray-500 hover:border-amber-400 hover:text-amber-700 transition-colors cursor-pointer">
                <Tag size={11} /> {tag}
              </span>
            ))}
          </div>
        </article>

        {/* Shop the Story */}
        {related.length > 0 && (
          <section className="border-t border-gray-200 py-14">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs text-amber-700 uppercase tracking-widest font-semibold mb-1">Shop the Story</p>
                <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Products You'll Love
                </h2>
              </div>
              <Link to="/catalog">
                <Button variant="secondary" size="sm" className="gap-1.5">Browse All <ArrowRight size={13} /></Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((product) => {
                const title   = product.product_title || product.title;
                const image   = product.product_main_image_url || product.image;
                const price   = product.target_sale_price || product.price;
                const buyLink = product.promotion_link || (product.slug ? `/go/${product.slug}` : '#');
                const pid     = product.product_id || product.id;
                return (
                  <div key={pid} className="group bg-white border border-gray-200 rounded-lg overflow-hidden flex hover:shadow-md transition-shadow">
                    <Link to={`/product/${pid}`} className="w-24 shrink-0">
                      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </Link>
                    <div className="p-4 flex flex-col justify-between flex-grow min-w-0">
                      <Link to={`/product/${pid}`}>
                        <h4 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-amber-700 transition-colors">{title}</h4>
                      </Link>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-semibold text-gray-900 text-sm">${parseFloat(price || 0).toFixed(2)}</span>
                        <a href={buyLink} target="_blank" rel="nofollow noopener">
                          <Button size="xs" variant="accent" className="gap-1">Buy <ExternalLink size={10} /></Button>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
