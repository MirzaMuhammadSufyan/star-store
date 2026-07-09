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
