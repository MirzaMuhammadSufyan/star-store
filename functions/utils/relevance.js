/**
 * The AliExpress affiliate `aliexpress.affiliate.product.query` endpoint matches
 * `keywords` against product titles/tags loosely (substring/tag match, not the
 * ranked relevance engine that powers aliexpress.com search). Searching "laptop"
 * therefore returns "laptop bag", "laptop stand", etc. because those titles also
 * contain the word "laptop".
 *
 * This filter removes results that only match because of an accessory term the
 * user didn't ask for, while requiring every searched word (in any order) to
 * appear in the title so multi-word queries like "gaming laptop" still match
 * titles such as "Laptop for Gaming 15.6 inch".
 */

const ACCESSORY_TERMS = [
  'bag', 'case', 'sleeve', 'cover', 'skin', 'pouch', 'stand', 'strap',
  'holder', 'protector', 'sticker', 'decal', 'charm', 'organizer',
  'dust plug', 'screen film',
];

export function filterByRelevance(products, keywords) {
  const kw = (keywords || '').trim().toLowerCase();
  if (!kw) return products;

  const kwWords = kw.split(/\s+/).filter(Boolean);

  return products.filter((p) => {
    const title = (p.product_title || '').toLowerCase();
    if (!kwWords.every((w) => title.includes(w))) return false;

    return !ACCESSORY_TERMS.some(
      (term) => title.includes(term) && !kwWords.includes(term),
    );
  });
}

/**
 * Applies the relevance filter, but falls back to the raw (unfiltered) results
 * if filtering would leave nothing — an overly strict filter should never turn
 * a non-empty result set into "no products found".
 */
export function applyRelevance(products, keywords, limit) {
  const filtered = filterByRelevance(products, keywords);
  const result = filtered.length > 0 ? filtered : products;
  return typeof limit === 'number' ? result.slice(0, limit) : result;
}
