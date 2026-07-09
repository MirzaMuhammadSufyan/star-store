/** Resolve the outbound affiliate URL regardless of which field was populated. */
export function getAffiliateLink(product) {
  return product?.affiliateLink || product?.promotion_link || '';
}

/** Direct affiliate URL, or masked /go/:slug route for manual products. */
export function getBuyLink(product) {
  const direct = getAffiliateLink(product);
  if (direct) return direct;
  if (product?.slug) return `/go/${product.slug}`;
  return '#';
}

/** Normalise link fields so RedirectPage and buy buttons always work. */
export function withNormalizedLinks(product) {
  const link = getAffiliateLink(product);
  if (!link) return product;
  return { ...product, affiliateLink: link, promotion_link: link };
}
