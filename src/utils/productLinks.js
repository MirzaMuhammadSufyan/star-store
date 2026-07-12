/** Resolve the outbound affiliate URL regardless of which field was populated. */
export function getAffiliateLink(product) {
  return product?.affiliateLink || product?.promotion_link || '';
}

/**
 * Stable slug used by /go/:slug redirects.
 * Prefers an explicit product.slug; falls back to id-{product_id|id}.
 */
export function getRedirectSlug(product) {
  if (product?.slug) return String(product.slug);
  const pid = product?.product_id || product?.id;
  if (pid != null && String(pid)) return `id-${pid}`;
  return '';
}

/**
 * Prefer the masked /go/:slug route so RedirectPage can log clicks and
 * apply affiliate consent before leaving the site. Falls back to a direct
 * affiliate URL only when no resolvable product id/slug exists.
 */
export function getBuyLink(product) {
  const affiliate = getAffiliateLink(product);
  const slug = getRedirectSlug(product);
  if (slug && affiliate) return `/go/${slug}`;
  if (slug) return `/go/${slug}`;
  return affiliate || '#';
}

/** Normalise link fields so RedirectPage and buy buttons always work. */
export function withNormalizedLinks(product) {
  const link = getAffiliateLink(product);
  if (!link) return product;
  return { ...product, affiliateLink: link, promotion_link: link };
}

/** Build a URL-safe slug from a product title. */
export function slugifyTitle(title = '') {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}
