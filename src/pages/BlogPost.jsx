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
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const post = allPosts.find((p) => p.id === id);
  const { products, syncLoading, syncFromAliExpress } = useProductStore();
  const articleRef = React.useRef(null);

  const canView = post && (isPublished(post) || isAdmin);

  // Load store products for the sidebar when the catalog isn't already in memory
  React.useEffect(() => {
    if (!post || products.length > 0) return;
    const { catalogSearch } = getArticleProductConfig(post);
    const kw = catalogSearch || post.category || 'tech gadgets';
    syncFromAliExpress(kw, 1, 24);
  }, [post?.id, products.length]); // eslint-disable-line react-hooks/exhaustive-deps

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

      <ReadingProgress targetRef={articleRef} />

      {/* Extra top padding clears navbar + separated progress strip */}
      <div className="mx-auto w-full max-w-7xl px-3 pt-8 sm:px-5 lg:px-6">
        {post.status === 'draft' && isAdmin && (
          <div className="mt-1 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
            Draft preview — only visible to admins.
          </div>
        )}

        <div className="grid gap-8 pb-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div ref={articleRef} className="min-w-0">
            <ArticleHero post={post} onBack={() => navigate('/blog')} />
            <ArticleBody post={post} />
            <AuthorBio post={post} />
          </div>

          <div className="min-w-0">
            <ArticleSidebar
              relatedArticles={relatedArticles}
              relatedProducts={relatedProducts}
              productsLoading={syncLoading && products.length === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
