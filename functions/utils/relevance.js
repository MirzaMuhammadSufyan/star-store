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

const ACCESSORY_TERMS = [
  'bag', 'case', 'sleeve', 'cover', 'skin', 'pouch', 'stand', 'strap',
  'holder', 'protector', 'sticker', 'decal', 'charm', 'organizer',
  'dust plug', 'screen film', 'cleaning', 'cleaner', 'blower', 'lens cap',
  'tripod', 'clamp', 'mount', 'dust', 'polarizer', 'microfiber',
  'selfie stick', 'charging dock', 'charger', 'charging cable', 'dock',
  'switch', 'mousepad', 'mouse pad', 'desk mat', 'wrist rest',
  'receiver', 'transmitter', 'antenna', 'connector', 'servo', 'sensor module',
];

const isAccessoryFree = (title, kwWords) =>
  !ACCESSORY_TERMS.some((term) => title.includes(term) && !kwWords.includes(term));

export function filterByRelevance(products, keywords) {
  const kw = (keywords || '').trim().toLowerCase();
  if (!kw) return products;

  const kwWords = kw.split(/\s+/).filter(Boolean);

  return products.filter((p) => {
    const title = (p.product_title || '').toLowerCase();
    return kwWords.every((w) => title.includes(w)) && isAccessoryFree(title, kwWords);
  });
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
  }

  return typeof limit === 'number' ? result.slice(0, limit) : result;
}

// category_id -> verified via aliexpress.affiliate.category.get on 2026-07-05.
// Some categories (e.g. Camera & Photo, Remote Control Toys) still mix real
// products with parts/accessories in AliExpress's own taxonomy — the title
// filter above is what catches those.
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
};

export function categoryIdForKeyword(keywords) {
  const kw = (keywords || '').trim().toLowerCase();
  return KEYWORD_CATEGORY_MAP[kw];
}
