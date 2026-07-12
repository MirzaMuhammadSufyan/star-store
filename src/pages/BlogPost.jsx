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
import { absoluteUrl, SITE_NAME } from '../config/site';
import { resolveAuthor } from '../content/authors';

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const allPosts = useBlogStore((s) => s.posts);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const post = allPosts.find((p) => p.id === id);
  const { products } = useProductStore();
  const articleRef = React.useRef(null);

  const canView = post && (isPublished(post) || isAdmin);

  const relatedArticles = React.useMemo(
    () => (post ? getRelatedPosts(post, allPosts, 5) : []),
    [post, allPosts],
  );

  const relatedProducts = React.useMemo(() => {
    if (!post) return [];
    const matched = getRelatedProducts(post, products, 5);
    if (matched.length >= 3) return matched;
    // Fill with other catalog items so the rail stays useful
    const ids = new Set(matched.map((p) => String(p.product_id || p.id)));
    const fillers = (products || []).filter((p) => !ids.has(String(p.product_id || p.id)));
    return [...matched, ...fillers].slice(0, 5);
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

  const showSidebar = relatedArticles.length > 0 || relatedProducts.length > 0;

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

      <div className="mx-auto w-full max-w-7xl px-3 pt-2 sm:px-5 lg:px-6">
        {post.status === 'draft' && isAdmin && (
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
            Draft preview — only visible to admins.
          </div>
        )}

        <div
          className={`grid gap-8 pb-12 lg:gap-10 ${
            showSidebar ? 'lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px]' : ''
          }`}
        >
          <div ref={articleRef} className="min-w-0">
            <ArticleHero post={post} onBack={() => navigate('/blog')} />
            <ArticleBody post={post} />
            <AuthorBio post={post} />
          </div>

          {showSidebar && (
            <div className="min-w-0">
              <ArticleSidebar
                relatedArticles={relatedArticles}
                relatedProducts={relatedProducts}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
