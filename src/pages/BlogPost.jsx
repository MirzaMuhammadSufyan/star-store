import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useBlogStore } from '../store/blogStore';
import { useProductStore } from '../store/productStore';
import { Button } from '../components/ui/Button';
import { ArticleHero } from '../components/blog/ArticleHero';
import { ArticleBody } from '../components/blog/ArticleBody';

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
    <div className="py-32 text-center">
      <p className="text-slate-400">Article not found.</p>
      <Link to="/blog" className="mt-4 inline-block text-sm text-amber-600 hover:underline">← Back to Journal</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ArticleHero post={post} onBack={() => navigate(-1)} />
        <ArticleBody post={post} />

        {/* Shop the Story */}
        {related.length > 0 && (
          <section className="border-t border-slate-200 py-14">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-600">Shop the Story</p>
                <h2 className="text-2xl font-bold text-slate-900">Products You'll Love</h2>
              </div>
              <Link to="/catalog">
                <Button variant="secondary" size="sm" className="gap-1.5">Browse All <ArrowRight size={13} /></Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {related.map((product) => {
                const title   = product.product_title || product.title;
                const image   = product.product_main_image_url || product.image;
                const price   = product.target_sale_price || product.price;
                const buyLink = product.promotion_link || (product.slug ? `/go/${product.slug}` : '#');
                const pid     = product.product_id || product.id;
                return (
                  <div key={pid} className="group flex overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md">
                    <Link to={`/product/${pid}`} className="w-24 shrink-0">
                      <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </Link>
                    <div className="flex min-w-0 flex-grow flex-col justify-between p-4">
                      <Link to={`/product/${pid}`}>
                        <h4 className="line-clamp-2 text-sm font-medium text-slate-800 transition-colors hover:text-amber-600">{title}</h4>
                      </Link>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900">${parseFloat(price || 0).toFixed(2)}</span>
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
