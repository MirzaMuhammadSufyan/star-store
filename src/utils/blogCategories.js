/**
 * Canonical Journal taxonomy — matches published seed/live volume:
 * Guides (largest), Technology, Lifestyle, Editorial, Reviews.
 * "All" is a UI filter, not a stored category.
 */
export const JOURNAL_CATEGORIES = [
  'Guides',
  'Technology',
  'Lifestyle',
  'Editorial',
  'Reviews',
];

export const JOURNAL_FILTERS = ['All', ...JOURNAL_CATEGORIES];

/** Categories that are editorial / non-commerce — no product upsell blocks. */
export const EDITORIAL_CATEGORIES = new Set(['Editorial']);

export function isEditorialCategory(category) {
  return EDITORIAL_CATEGORIES.has(category);
}

/** Build filter tabs from published posts, preserving canonical order. */
export function categoriesFromPosts(posts = []) {
  const present = new Set(
    posts.map((p) => p.category).filter((c) => c && c !== 'All'),
  );
  const ordered = JOURNAL_CATEGORIES.filter((c) => present.has(c));
  const extras = [...present].filter((c) => !JOURNAL_CATEGORIES.includes(c)).sort();
  return ['All', ...ordered, ...extras];
}
