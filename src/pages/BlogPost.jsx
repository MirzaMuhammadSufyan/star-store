import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Clock, ExternalLink } from 'lucide-react';
import { useBlogStore } from '../store/blogStore';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { ArticleHero } from '../components/blog/ArticleHero';
import { ArticleBody } from '../components/blog/ArticleBody';
import SEO from '../components/SEO';
import { isPublished, getRelatedPosts, getRelatedProducts, resolveBlogImage } from '../utils/blogUtils';
import { getArticleProductConfig } from '../utils/articleProductMap';
import { isEditorialCategory } from '../utils/blogCategories';
import { getBuyLink } from '../utils/productLinks';

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const allPosts = useBlogStore((s) => s.posts);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const post = allPosts.find((p) => p.id === id);
  const { products } = useProductStore();

  const canView = post && (isPublished(post) || isAdmin);

  const relatedProducts = React.useMemo(
    () => getRelatedProducts(post, products, 3),
    [products, post],
  );

  const coverImage = post ? resolveBlogImage(post) : '';
  const productConfig = post ? getArticleProductConfig(post) : null;

  const relatedArticles = React.useMemo(
    () => (post ? getRelatedPosts(post, allPosts, 3) : []),
    [post, allPosts],
  );

  if (!canView) {
    return (
      <div className="py-32 text-center">
        <p className="text-slate-400">Article not found.</p>
        <Link to="/blog" className="mt-4 inline-block text-sm text-amber-600 hover:underline">← Back to Journal</Link>
      </div>
    );
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: coverImage ? [coverImage] : undefined,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: { '@type': 'Organization', name: post.author || 'Star Store Editorial' },
    publisher: {
      '@type': 'Organization',
      name: 'Star Store',
      logo: { '@type': 'ImageObject', url: 'https://starstore.com/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://starstore.com/blog/${post.id}` },
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={post.title}
        description={post.excerpt}
        image={coverImage}
        url={`/blog/${post.id}`}
        type="article"
        structuredData={articleSchema}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {post.status === 'draft' && isAdmin && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            Draft preview — only visible to admins.
          </div>
        )}
        <ArticleHero post={post} onBack={() => navigate(-1)} />
        <ArticleBody post={post} />

        {relatedArticles.length > 0 && (
          <section className="border-t border-slate-200 py-14">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-600">Keep Reading</p>
            <h2 className="mb-8 text-2xl font-bold text-slate-900">Related Articles</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {relatedArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.id}`}
                  className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={resolveBlogImage(article)}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-600">{article.category}</p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-amber-700">
                      {article.title}
                    </h3>
                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={11} /> {article.date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {relatedProducts.length > 0 && !isEditorialCategory(post.category) && (
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
              {relatedProducts.map((product) => {
                const title = product.product_title || product.title;
                const image = product.product_main_image_url || product.image;
                const price = product.target_sale_price || product.price;
                const buyLink = getBuyLink(product);
                const pid = product.product_id || product.id;
                const isExternal = buyLink.startsWith('http');
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
                        <a
                          href={buyLink}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'nofollow noopener' : undefined}
                        >
                          <Button size="xs" variant="accent" className="gap-1">
                            Buy <ExternalLink size={10} />
                          </Button>
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
