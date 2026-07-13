import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBlogStore } from '../store/blogStore';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { ArticleHero } from '../components/blog/ArticleHero';
import { ArticleBody } from '../components/blog/ArticleBody';
import { AuthorBio } from '../components/blog/AuthorBio';
import { ArticleSidebar } from '../components/blog/ArticleSidebar';
import { ReadingProgress } from '../components/blog/ReadingProgress';
import SEO from '../components/SEO';
import { getRelatedPosts, getRelatedProducts, resolveBlogImage, isPublished } from '../utils/blogUtils';
import { getArticleProductConfig } from '../utils/articleProductMap';
import { absoluteUrl, SITE_NAME } from '../config/site';
import { resolveAuthor } from '../content/authors';

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const allPosts = useBlogStore((s) => s.posts);
  const blogsLoading = useBlogStore((s) => s.loading);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const post = allPosts.find((p) => p.id === id);
  const {
    products,
    apiProducts,
    syncLoading,
    dbLoading,
    ensureCatalogProducts,
  } = useProductStore();
  const articleRef = React.useRef(null);
  const [sidebarReady, setSidebarReady] = React.useState(() => apiProducts.length > 0);

  const canView = post && (isPublished(post) || isAdmin);

  // Always hydrate live catalog products for the sidebar on direct article visits.
  React.useEffect(() => {
    if (!post || dbLoading) return;
    let cancelled = false;
    setSidebarReady(apiProducts.length > 0);

    const { catalogSearch } = getArticleProductConfig(post);
    ensureCatalogProducts(catalogSearch || 'tech gadgets').finally(() => {
      if (!cancelled) setSidebarReady(true);
    });

    return () => { cancelled = true; };
  }, [post?.id, dbLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const relatedArticles = React.useMemo(
    () => (post ? getRelatedPosts(post, allPosts, 4) : []),
    [post, allPosts],
  );

  const relatedProducts = React.useMemo(() => {
    if (!post) return [];
    const matched = getRelatedProducts(post, products, 4);
    if (matched.length >= 3) return matched;
    const ids = new Set(matched.map((p) => String(p.product_id || p.id)));
    const fillers = (products || []).filter((p) => !ids.has(String(p.product_id || p.id)));
    return [...matched, ...fillers].slice(0, 4);
  }, [products, post]);

  const coverImage = post ? resolveBlogImage(post) : '';
  const author = post ? resolveAuthor(post) : null;
  const productsLoading = !sidebarReady || ((syncLoading || dbLoading) && relatedProducts.length === 0);

  if (blogsLoading && !post) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-200 border-t-amber-500" />
        <p className="text-sm text-stone-500">Loading article…</p>
      </div>
    );
  }

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
    <div className="min-h-screen bg-canvas">
      <SEO
        title={post.title}
        description={post.excerpt}
        image={coverImage}
        url={`/blog/${post.id}`}
        type="article"
        structuredData={articleSchema}
      />

      <ReadingProgress targetRef={articleRef} />

      {/* Extra top padding clears navbar + separated progress strip */}
      <div className="mx-auto w-full max-w-7xl px-3 pt-8 sm:px-5 lg:px-6">
        {post.status === 'draft' && isAdmin && (
          <div className="mt-1 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
            Draft preview — only visible to admins.
          </div>
        )}

        <div className="grid items-start gap-8 pb-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_300px]">
          <article ref={articleRef} className="min-w-0">
            <ArticleHero post={post} onBack={() => navigate('/blog')} />
            <ArticleBody post={post} />
            <AuthorBio post={post} />
          </article>

          <div className="min-w-0">
            <ArticleSidebar
              relatedArticles={relatedArticles}
              relatedProducts={relatedProducts}
              productsLoading={productsLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
