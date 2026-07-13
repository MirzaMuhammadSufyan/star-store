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

const MOBILE_PRODUCT_COUNT = 3;
const MAX_PRODUCT_COUNT = 12;

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const allPosts = useBlogStore((s) => s.posts);
  const blogsLoading = useBlogStore((s) => s.loading);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const post = allPosts.find((p) => p.id === id);
  const {
    products,
    syncLoading,
    dbLoading,
    fetchAndMergeProducts,
  } = useProductStore();
  const articleRef = React.useRef(null);
  const sidebarRef = React.useRef(null);
  const [sidebarReady, setSidebarReady] = React.useState(false);
  /** How many product cards fit beside this article (no sidebar scrollbar). */
  const [fitCount, setFitCount] = React.useState(MOBILE_PRODUCT_COUNT);

  const canView = post && (isPublished(post) || isAdmin);

  // Always fetch products for THIS article's topic so the sidebar stays relevant.
  React.useEffect(() => {
    if (!post || dbLoading) return;
    let cancelled = false;
    setSidebarReady(false);

    const { catalogSearch } = getArticleProductConfig(post);
    fetchAndMergeProducts(catalogSearch || 'tech gadgets', 24).finally(() => {
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
    return getRelatedProducts(post, products, MAX_PRODUCT_COUNT);
  }, [products, post]);

  const visibleProducts = React.useMemo(
    () => relatedProducts.slice(0, fitCount),
    [relatedProducts, fitCount],
  );

  const coverImage = post ? resolveBlogImage(post) : '';
  const author = post ? resolveAuthor(post) : null;
  const productsLoading = !sidebarReady || (syncLoading && relatedProducts.length === 0);

  // Fit product count to article height — no nested scrollbar.
  React.useLayoutEffect(() => {
    if (!canView) return undefined;

    const calc = () => {
      const article = articleRef.current;
      const sidebar = sidebarRef.current;
      if (!article || !sidebar) return;

      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      if (!desktop) {
        setFitCount((prev) => (prev === MOBILE_PRODUCT_COUNT ? prev : MOBILE_PRODUCT_COUNT));
        return;
      }

      const articleH = article.offsetHeight;
      const articlesBlock = sidebar.querySelector('[data-sidebar-articles]');
      const productsBlock = sidebar.querySelector('[data-sidebar-products]');
      const articlesH = articlesBlock?.offsetHeight ?? 0;
      const productsChrome = (() => {
        // Heading + "Browse catalog" link + section padding, excluding product list
        if (!productsBlock) return 72;
        const list = productsBlock.querySelector('[data-sidebar-product-list]');
        const listH = list?.offsetHeight ?? 0;
        return Math.max(56, productsBlock.offsetHeight - listH);
      })();

      const available = Math.max(0, articleH - articlesH - 16 - productsChrome);
      const sample = sidebar.querySelector('[data-sidebar-product]');
      // Square image ≈ column content width; text block ~100px. Fallback if none rendered yet.
      const railInner = Math.max(200, sidebar.clientWidth - 24);
      const estimatedCard = railInner + 100;
      const cardH = sample?.offsetHeight || estimatedCard;
      const gap = 12;
      const next = Math.max(
        1,
        Math.min(
          MAX_PRODUCT_COUNT,
          relatedProducts.length || 1,
          Math.floor((available + gap) / (cardH + gap)),
        ),
      );

      setFitCount((prev) => (prev === next ? prev : next));
    };

    calc();
    const raf = requestAnimationFrame(calc);
    const article = articleRef.current;
    const sidebar = sidebarRef.current;
    const ro = new ResizeObserver(calc);
    if (article) ro.observe(article);
    if (sidebar) ro.observe(sidebar);
    window.addEventListener('resize', calc);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', calc);
    };
  }, [
    canView,
    post?.id,
    sidebarReady,
    relatedArticles.length,
    relatedProducts.length,
    visibleProducts.length,
  ]);

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

        <div className="grid items-start gap-6 pb-12 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-7 xl:grid-cols-[minmax(0,1fr)_255px]">
          <article ref={articleRef} className="min-w-0">
            <ArticleHero post={post} onBack={() => navigate('/blog')} />
            <ArticleBody post={post} />
            <AuthorBio post={post} />
          </article>

          <aside ref={sidebarRef} className="min-w-0 lg:sticky lg:top-[6.75rem] lg:self-start">
            <ArticleSidebar
              relatedArticles={relatedArticles}
              relatedProducts={visibleProducts}
              productsLoading={productsLoading}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
