/**
 * The AliExpress affiliate `aliexpress.affiliate.product.query` endpoint matches
 * `keywords` against product titles/tags loosely — a plain "laptop" search
 * returns Computer Peripherals / Storage Device / Accessories products whose
 * titles just mention "laptop" as a compatibility note (e.g. "USB Hub ... for
 * MacBook Notebook Laptop"), not actual laptops. Confirmed by pulling the raw
 * API response directly: none of the top 20 unfiltered results for "laptop"
 * were even in a laptop-related category.
 *
 * The fix is pinning well-known searches to the right `category_ids`, which
 * are IDs the AliExpress API itself returns as the correct category for that
 * kind of product — verified live via aliexpress.affiliate.category.get
 * against this account, not guessed. The title-based filter below is a
 * secondary safety net for keywords that aren't in the map.
 */

import { CATEGORIES } from './categories.js';

// Grouped so a query word exempts every synonym in its group, not just the
// literal string typed. Without this, searching "iphone case" still got
// filtered out for titles ending in "...Bumper Cover" — "cover" was flagged
// as a stray accessory term because the query said "case", not "cover", even
// though they're the same product. This was silently destroying relevant
// results for any accessory-type product search (cases, stands, bags), which
// is exactly the kind of product people search for directly.
const ACCESSORY_GROUPS = [
  ['case', 'cover', 'shell', 'skin'],
  ['bag', 'pouch', 'sleeve'],
  ['stand', 'mount', 'holder', 'dock', 'cradle', 'bracket'],
  ['charger', 'charging'],
  ['strap', 'lanyard'],
  ['protector', 'film'],
  ['sticker', 'decal'],
  ['cleaning', 'cleaner', 'blower', 'microfiber'],
  ['tripod', 'clamp'],
  ['dust', 'dust plug'],
  ['polarizer'],
  ['lens cap'],
  ['selfie stick'],
  ['switch'],
  ['mousepad', 'mouse pad', 'desk mat', 'wrist rest'],
  ['receiver', 'transmitter', 'antenna', 'connector', 'servo'],
  ['organizer'],
];

const ACCESSORY_TERMS = [...new Set(ACCESSORY_GROUPS.flat())];

const groupFor = (term) => ACCESSORY_GROUPS.find((g) => g.includes(term));

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Whole-word containment — a plain `.includes()` would let "cycle" match
// inside "bicycle"/"motorcycle"/"recycle", which is how a "cycle" search
// used to surface unrelated motorcycle/recycling-bin products.
const hasWord = (title, word) => new RegExp(`\\b${escapeRegex(word)}\\b`, 'i').test(title);

const isAccessoryFree = (title, kwWords) =>
  !ACCESSORY_TERMS.some((term) => {
    if (!hasWord(title, term)) return false;
    const group = groupFor(term) || [term];
    return !group.some((synonym) => kwWords.includes(synonym));
  });

export function filterByRelevance(products, keywords) {
  const kw = (keywords || '').trim().toLowerCase();
  if (!kw) return products;

  const kwWords = kw.split(/\s+/).filter(Boolean);

  return products.filter((p) => {
    const title = (p.product_title || '').toLowerCase();
    return kwWords.every((w) => hasWord(title, w)) && isAccessoryFree(title, kwWords);
  });
}

/**
 * Ranks (doesn't filter) results that already passed the relevance filter, so
 * a product whose title/category is centrally about the query outranks one
 * that just happens to mention it. Filtering alone can't catch a case like
 * "phone stand" returning a neck fan that has a phone stand as a bundled
 * feature — the title genuinely contains "phone stand", so no word-match
 * filter rejects it, but its category ("Neck Fans", not "Phone Holders &
 * Stands") gives away that it isn't a phone stand product. Ranking pushes the
 * genuine stands above it instead of trying to exclude the fan outright.
 */
export function rankByRelevance(products, keywords) {
  const kw = (keywords || '').trim().toLowerCase();
  if (!kw) return products;
  const kwWords = kw.split(/\s+/).filter(Boolean);
  const phrase = kwWords.join(' ');

  const scored = products.map((p, i) => {
    const title = (p.product_title || '').toLowerCase();
    const category = `${p.first_level_category_name || ''} ${p.second_level_category_name || ''}`.toLowerCase();

    let score = 0;
    if (title.includes(phrase)) score += 3;
    if (kwWords.some((w) => hasWord(category, w))) score += 2;
    const firstIdx = title.indexOf(kwWords[0] || '');
    if (firstIdx >= 0 && firstIdx < 15) score += 1;

    return { p, i, score };
  });

  scored.sort((a, b) => b.score - a.score || a.i - b.i);
  return scored.map((s) => s.p);
}

/**
 * Applies the relevance filter, degrading in two steps rather than switching
 * off entirely the moment the strictest pass comes up empty:
 *   1. title contains every query word AND has no stray accessory terms
 *   2. (fallback) just no stray accessory terms — covers cases like a
 *      category-narrowed "drone" query where genuine results (FPV/RC parts)
 *      don't literally say "drone" in the title
 *   3. (last resort) the raw, unfiltered results — never turn a non-empty
 *      result set into "no products found"
 * The surviving set is then ranked (see rankByRelevance) before trimming to
 * `limit`, so the most on-topic items make the cut rather than whatever
 * happened to appear first in AliExpress's own ordering.
 */
export function applyRelevance(products, keywords, limit) {
  const kw = (keywords || '').trim().toLowerCase();
  let result = products;

  if (kw) {
    const kwWords = kw.split(/\s+/).filter(Boolean);
    const strict = filterByRelevance(products, keywords);
    if (strict.length > 0) {
      result = strict;
    } else {
      const accessoryFreeOnly = products.filter((p) =>
        isAccessoryFree((p.product_title || '').toLowerCase(), kwWords));
      result = accessoryFreeOnly.length > 0 ? accessoryFreeOnly : products;
    }
    result = rankByRelevance(result, keywords);
  }

  return typeof limit === 'number' ? result.slice(0, limit) : result;
}

// category_id -> verified via aliexpress.affiliate.category.get on 2026-07-05.
// Some categories (e.g. Camera & Photo, Remote Control Toys, Cycling) mix real
// products with parts/accessories in AliExpress's own taxonomy, and some
// (drones, whole bicycles) apparently aren't stocked as finished products in
// this affiliate catalog at all — only their accessories/parts are. The title
// filter above is what catches the parts/accessories mixed in.
const CATEGORY = {
  LAPTOPS: '702',
  DESKTOPS: '701',
  MINI_PC: '70803003',
  COMPUTER_PERIPHERALS: '200001081',
  LAPTOP_PARTS_ACCESSORIES: '200001083',
  STORAGE_DEVICE: '200001074',
  TABLETS: '200001086',
  MOBILE_PHONES: '5090301',
  MOBILE_PHONE_ACCESSORIES: '100001205',
  CAMERA_PHOTO: '100000305',
  PORTABLE_AUDIO_VIDEO: '100000306',
  SMART_ELECTRONICS: '200003803',
  GAMES_ACCESSORIES: '100000310',
  LAPTOP_BAGS: '152402',
  REMOTE_CONTROL_TOYS: '200001385',
  CYCLING: '200003500',
};

export const KEYWORD_CATEGORY_MAP = {
  laptop: CATEGORY.LAPTOPS,
  laptops: CATEGORY.LAPTOPS,
  notebook: CATEGORY.LAPTOPS,
  notebooks: CATEGORY.LAPTOPS,
  'gaming laptop': CATEGORY.LAPTOPS,
  desktop: CATEGORY.DESKTOPS,
  'desktop pc': CATEGORY.DESKTOPS,
  'mini pc': CATEGORY.MINI_PC,
  keyboard: CATEGORY.COMPUTER_PERIPHERALS,
  keyboards: CATEGORY.COMPUTER_PERIPHERALS,
  mouse: CATEGORY.COMPUTER_PERIPHERALS,
  mice: CATEGORY.COMPUTER_PERIPHERALS,
  webcam: CATEGORY.COMPUTER_PERIPHERALS,
  'usb hub': CATEGORY.COMPUTER_PERIPHERALS,
  'laptop stand': CATEGORY.LAPTOP_PARTS_ACCESSORIES,
  'laptop cooling pad': CATEGORY.LAPTOP_PARTS_ACCESSORIES,
  'laptop bag': CATEGORY.LAPTOP_BAGS,
  'external ssd': CATEGORY.STORAGE_DEVICE,
  ssd: CATEGORY.STORAGE_DEVICE,
  tablet: CATEGORY.TABLETS,
  tablets: CATEGORY.TABLETS,
  smartphone: CATEGORY.MOBILE_PHONES,
  smartphones: CATEGORY.MOBILE_PHONES,
  phone: CATEGORY.MOBILE_PHONES,
  'phone accessories': CATEGORY.MOBILE_PHONE_ACCESSORIES,
  camera: CATEGORY.CAMERA_PHOTO,
  cameras: CATEGORY.CAMERA_PHOTO,
  headphone: CATEGORY.PORTABLE_AUDIO_VIDEO,
  headphones: CATEGORY.PORTABLE_AUDIO_VIDEO,
  earbuds: CATEGORY.PORTABLE_AUDIO_VIDEO,
  'wireless earbuds': CATEGORY.PORTABLE_AUDIO_VIDEO,
  speaker: CATEGORY.PORTABLE_AUDIO_VIDEO,
  speakers: CATEGORY.PORTABLE_AUDIO_VIDEO,
  'bluetooth speaker': CATEGORY.PORTABLE_AUDIO_VIDEO,
  smartwatch: CATEGORY.SMART_ELECTRONICS,
  'smart watch': CATEGORY.SMART_ELECTRONICS,
  drone: CATEGORY.REMOTE_CONTROL_TOYS,
  drones: CATEGORY.REMOTE_CONTROL_TOYS,
  'smart home': CATEGORY.SMART_ELECTRONICS,
  'vr headset': CATEGORY.SMART_ELECTRONICS,
  'gaming headset': CATEGORY.GAMES_ACCESSORIES,
  'gaming gear': CATEGORY.GAMES_ACCESSORIES,
  cycle: CATEGORY.CYCLING,
  cycling: CATEGORY.CYCLING,
  bicycle: CATEGORY.CYCLING,
  bike: CATEGORY.CYCLING,
};

// Words that are structurally part of category names but shouldn't count
// toward a real product match (or should actively push a match down when the
// user didn't ask for them) — mirrors the accessory-avoidance logic above.
const CATEGORY_NOISE_WORDS = new Set(['and', 'the', 'for', 'of', 'other', 'new']);
const CATEGORY_DEPRIORITIZE_WORDS = new Set(['parts', 'accessories', 'accessory', 'supplies', 'equipment']);

const stem = (w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w);

const tokenize = (s) =>
  s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w && !CATEGORY_NOISE_WORDS.has(w)).map(stem);

let categoryIndex = null;
function getCategoryIndex() {
  if (categoryIndex) return categoryIndex;
  categoryIndex = CATEGORIES.map((c) => ({ ...c, tokens: tokenize(c.name) }));
  return categoryIndex;
}

/**
 * Matches an arbitrary, unmapped search term against AliExpress's real
 * category names (all 565 categories pulled live via
 * aliexpress.affiliate.category.get) instead of giving up the moment a term
 * isn't in the curated KEYWORD_CATEGORY_MAP above. This is what makes
 * category-narrowing work for search terms nobody has hand-picked yet — a
 * user typing "gaming mouse" or "iphone case" still gets matched against a
 * real category, not just the ~40 keywords someone happened to add.
 */
function findBestCategoryMatch(keywords) {
  const kwWords = tokenize(keywords);
  if (kwWords.length === 0) return undefined;

  let best = null;
  for (const cat of getCategoryIndex()) {
    if (cat.tokens.length === 0) continue;
    const matched = kwWords.filter((w) => cat.tokens.includes(w));
    if (matched.length === 0) continue;

    // Fraction of the category name's own words that the query accounts for —
    // rewards precise category names ("Laptops") over broad umbrella ones
    // ("Computer & Office") that happen to share one word.
    const precision = matched.length / cat.tokens.length;
    const recall = matched.length / kwWords.length;
    let score = precision + recall;

    const hasNoiseInName = cat.tokens.some((t) => CATEGORY_DEPRIORITIZE_WORDS.has(t));
    const userAskedForNoise = kwWords.some((t) => CATEGORY_DEPRIORITIZE_WORDS.has(t));
    if (hasNoiseInName && !userAskedForNoise) score -= 0.5;

    if (!best || score > best.score) best = { id: cat.id, score };
  }

  // Require at least full recall (every query word matched somewhere in the
  // category name) so a single shared word doesn't pin unrelated searches.
  return best && best.score >= 1.5 ? best.id : undefined;
}

export function categoryIdForKeyword(keywords) {
  const kw = (keywords || '').trim().toLowerCase();
  return KEYWORD_CATEGORY_MAP[kw] || findBestCategoryMatch(kw);
}
