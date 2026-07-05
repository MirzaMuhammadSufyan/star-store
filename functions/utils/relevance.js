/**
 * The AliExpress affiliate `aliexpress.affiliate.product.query` endpoint matches
 * `keywords` against product titles/tags loosely (substring/tag match, not the
 * ranked relevance engine that powers aliexpress.com search). Searching "laptop"
 * therefore returns "laptop bag", "laptop stand", etc. because those titles also
 * contain the word "laptop".
 *
 * This filter removes results that only match because of an accessory term the
 * user didn't ask for, and requires the full search phrase to appear in the title.
 */

const ACCESSORY_TERMS = [
  'bag', 'case', 'sleeve', 'cover', 'skin', 'pouch', 'stand', 'strap',
  'holder', 'protector', 'sticker', 'decal', 'charm', 'organizer',
  'dust plug', 'screen film',
];

export function filterByRelevance(products, keywords) {
  const kw = (keywords || '').trim().toLowerCase();
  if (!kw) return products;

  const kwWords = kw.split(/\s+/);

  return products.filter((p) => {
    const title = (p.product_title || '').toLowerCase();
    if (!title.includes(kw)) return false;

    return !ACCESSORY_TERMS.some(
      (term) => title.includes(term) && !kwWords.includes(term),
    );
  });
}

/**
 * Known AliExpress category IDs for common tech search terms. Restricting the
 * query to the right category is a much stronger relevance signal than keyword
 * text alone. Verify/refresh these against your account via
 * aliexpress.affiliate.category.get — IDs can vary by account/locale.
 */
export const KEYWORD_CATEGORY_MAP = {
  laptop: '100003109',
  laptops: '100003109',
  notebook: '100003109',
  phone: '509',
  smartphone: '509',
  headphone: '6',
  headphones: '6',
  earbuds: '6',
  smartwatch: '1511',
  tablet: '200000343',
  camera: '3',
  drone: '200003482',
  speaker: '6',
  monitor: '7',
  keyboard: '100003806',
  mouse: '100003806',
};

export function categoryIdForKeyword(keywords) {
  const kw = (keywords || '').trim().toLowerCase();
  return KEYWORD_CATEGORY_MAP[kw];
}
