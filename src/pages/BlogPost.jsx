import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Clock, ExternalLink } from 'lucide-react';
import { useBlogStore } from '../store/blogStore';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { ArticleHero } from '../components/blog/ArticleHero';
import { ArticleBody } from '../components/blog/ArticleBody';
import { AuthorBio } from '../components/blog/AuthorBio';
import SEO from '../components/SEO';
import { getRelatedPosts, getRelatedProducts, resolveBlogImage, isPublished } from '../utils/blogUtils';
import { isEditorialCategory } from '../utils/blogCategories';
import { getBuyLink } from '../utils/productLinks';
import { absoluteUrl, SITE_NAME } from '../config/site';
import { resolveAuthor } from '../content/authors';

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
  const author = post ? resolveAuthor(post) : null;

  const relatedArticles = React.useMemo(
    () => (post ? getRelatedPosts(post, allPosts, 3) : []),
    [post, allPosts],
  );

  if (!canView) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-stone-400">Article not found.</p>
        <Link to="/blog" className="mt-3 inline-block text-sm text-amber-700 hover:underline">
          ← Back to Journal
        </Link>
      </div>
    );
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: coverImage ? [coverImage.startsWith('http') ? coverImage : absoluteUrl(coverImage)] : undefined,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: author.name,
      description: author.bio || undefined,
      jobTitle: author.role || undefined,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.png') },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(`/blog/${post.id}`) },
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <SEO
        title={post.title}
        description={post.excerpt}
        image={coverImage}
        url={`/blog/${post.id}`}
        type="article"
        structuredData={articleSchema}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        {post.status === 'draft' && isAdmin && (
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
            Draft preview — only visible to admins.
          </div>
        )}
        <ArticleHero post={post} onBack={() => navigate('/blog')} />
        <ArticleBody post={post} />
        <AuthorBio post={post} />

        {relatedArticles.length > 0 && (
          <section className="border-t border-stone-200 py-8">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-stone-500">
                Keep reading
              </h2>
              <Link to="/blog" className="text-xs font-medium text-amber-700 hover:underline">
                All articles
              </Link>
            </div>
            <div className="space-y-0 divide-y divide-stone-200 border-y border-stone-200">
              {relatedArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.id}`}
                  className="group flex gap-3 py-3 transition-colors hover:bg-white/70"
                >
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded bg-stone-100 sm:h-[4.5rem] sm:w-28">
                    <img
                      src={resolveBlogImage(article)}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1 py-0.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-700">
                      {article.category}
                    </p>
                    <h3 className="mt-0.5 line-clamp-2 text-[14px] font-semibold leading-snug text-stone-900 group-hover:text-amber-800">
                      {article.title}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-stone-500">
                      <Clock size={10} /> {article.date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {relatedProducts.length > 0 && !isEditorialCategory(post.category) && (
          <section className="border-t border-stone-200 py-8 pb-12">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-stone-500">
                Shop the story
              </h2>
              <Link to="/catalog" className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:underline">
                Browse all <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-2">
              {relatedProducts.map((product) => {
                const title = product.product_title || product.title;
                const image = product.product_main_image_url || product.image;
                const price = product.target_sale_price || product.price;
                const buyLink = getBuyLink(product);
                const pid = product.product_id || product.id;
                const isExternal = buyLink.startsWith('http');
                return (
                  <div
                    key={pid}
                    className="group flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-2.5 transition-colors hover:border-amber-300"
                  >
                    <Link to={`/product/${pid}`} className="h-14 w-14 shrink-0 overflow-hidden rounded bg-stone-50">
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link to={`/product/${pid}`}>
                        <h4 className="line-clamp-1 text-[13px] font-medium text-stone-800 hover:text-amber-700">
                          {title}
                        </h4>
                      </Link>
                      <p className="mt-0.5 text-[13px] font-semibold text-stone-900">
                        ${parseFloat(price || 0).toFixed(2)}
                      </p>
                    </div>
                    <a
                      href={buyLink}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'nofollow noopener' : undefined}
                      className="shrink-0"
                    >
                      <Button size="xs" variant="accent" className="gap-1">
                        Buy <ExternalLink size={10} />
                      </Button>
                    </a>
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
