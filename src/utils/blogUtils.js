import { getSeedArticle } from '../content/seedArticles';
import { getArticleProductConfig } from './articleProductMap';

/** Resolve hero/card image — fixes stale .png paths and missing coverImage. */
export function resolveBlogImage(post) {
  if (!post) return '';

  let url = (post.image || post.coverImage || '').trim();

  if (post.seedKey) {
    const seed = getSeedArticle(post.seedKey);
    if (seed?.image) url = seed.image;
  }

  if (url.startsWith('/images/blog/') && url.endsWith('.png')) {
    url = url.replace(/\.png$/, '.webp');
  }

  return url;
}

/** Match products by article keywords/tags instead of blog category name. */
export function getRelatedProducts(post, products, limit = 3) {
  if (!post || !products?.length) return [];

  const { keywords } = getArticleProductConfig(post);
  const terms = keywords.map((k) => k.toLowerCase()).filter(Boolean);

  const scored = products.map((product) => {
    const title = (product.product_title || product.title || '').toLowerCase();
    const category = (product.second_level_category_name || product.category || product.merchant || '').toLowerCase();
    let score = 0;

    for (const term of terms) {
      if (title.includes(term)) score += 4;
      if (category.includes(term)) score += 2;
      const words = term.split(/\s+/).filter((w) => w.length > 2);
      for (const word of words) {
        if (title.includes(word)) score += 1;
      }
    }

    return { product, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const matched = scored.filter((s) => s.score > 0).map((s) => s.product);

  if (matched.length >= limit) return matched.slice(0, limit);
  return matched;
}

/** Legacy posts without a status field are treated as published. */
export function isPublished(post) {
  if (!post) return false;
  if (post.status === undefined || post.status === null) return true;
  return post.status === 'published';
}

export function getPublishedPosts(posts) {
  return (posts || []).filter(isPublished);
}

/** ~200 wpm; strips HTML before counting. */
export function estimateReadingTime(content) {
  const text = (content || '').replace(/<[^>]*>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function getRelatedPosts(post, allPosts, limit = 3) {
  if (!post) return [];
  const pool = getPublishedPosts(allPosts).filter((p) => p.id !== post.id);
  const postTags = new Set(post.tags || []);

  const scored = pool.map((p) => {
    let score = 0;
    if (p.category && p.category === post.category) score += 2;
    for (const tag of p.tags || []) {
      if (postTags.has(tag)) score += 3;
    }
    return { post: p, score };
  });

  scored.sort((a, b) => b.score - a.score || (b.post.createdAt || '').localeCompare(a.post.createdAt || ''));
  const picked = scored.filter((s) => s.score > 0).map((s) => s.post);

  if (picked.length >= limit) return picked.slice(0, limit);
  const rest = pool.filter((p) => !picked.some((x) => x.id === p.id));
  return [...picked, ...rest].slice(0, limit);
}
