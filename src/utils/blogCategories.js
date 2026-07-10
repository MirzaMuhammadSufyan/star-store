/** Categories that are editorial / non-commerce — no product upsell blocks. */
export const EDITORIAL_CATEGORIES = new Set(['Editorial']);

export function isEditorialCategory(category) {
  return EDITORIAL_CATEGORIES.has(category);
}
