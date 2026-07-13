/**
 * Maps articles to catalog search terms and product-matching keywords.
 * Blog categories (Guides, Technology) do not match store categories — use this instead.
 */
export const ARTICLE_PRODUCT_MAP = {
  'wireless-earbuds-buying-guide-2026': {
    catalogSearch: 'wireless earbuds',
    keywords: ['earbuds', 'earphone', 'tws', 'bluetooth earphone', 'wireless headphone', 'airpods'],
  },
  'usb-c-charging-explained': {
    catalogSearch: 'usb c charger',
    keywords: ['usb c', 'usb-c', 'charger', 'gan charger', 'power delivery', 'charging cable', 'pd charger'],
  },
  'smart-home-security-guide': {
    catalogSearch: 'security camera',
    keywords: ['security camera', 'smart lock', 'doorbell', 'motion sensor', 'surveillance', 'wifi camera'],
  },
  'buying-tech-on-a-budget': {
    catalogSearch: 'electronics',
    keywords: ['gadget', 'electronics', 'accessories', 'phone', 'headphone', 'charger'],
  },
  'spot-fake-product-reviews': {
    catalogSearch: 'electronics',
    keywords: ['gadget', 'electronics', 'phone accessory', 'headphone', 'smart watch'],
  },
  'ergonomic-desk-setup-remote-work': {
    catalogSearch: 'desk chair',
    keywords: ['ergonomic chair', 'desk', 'monitor stand', 'keyboard', 'mouse pad', 'laptop stand', 'webcam'],
  },
  'power-banks-explained': {
    catalogSearch: 'power bank',
    keywords: ['power bank', 'portable charger', 'battery pack', 'magsafe'],
  },
  'mechanical-vs-membrane-keyboards': {
    catalogSearch: 'mechanical keyboard',
    keywords: ['mechanical keyboard', 'gaming keyboard', 'keyboard', 'keycap', 'switch keyboard'],
  },
  'dispose-old-gadgets-e-waste': {
    catalogSearch: 'electronics',
    keywords: ['phone', 'tablet', 'laptop', 'charger', 'cable', 'electronics'],
  },
  'noise-cancelling-how-anc-works': {
    catalogSearch: 'noise cancelling headphones',
    keywords: ['headphone', 'earphone', 'anc', 'noise cancelling', 'bluetooth headphone', 'earbuds'],
  },
  'monitor-buying-guide-2026': {
    catalogSearch: 'monitor',
    keywords: ['monitor', 'display', 'gaming monitor', 'portable monitor', 'screen'],
  },
  'laptop-ram-storage-explained': {
    catalogSearch: 'laptop',
    keywords: ['laptop', 'notebook', 'ssd', 'hard drive', 'ram', 'memory'],
  },
  'wifi-mesh-network-guide': {
    catalogSearch: 'wifi router',
    keywords: ['router', 'mesh', 'wifi', 'repeater', 'extender', 'access point'],
  },
  'smartphone-camera-sensors': {
    catalogSearch: 'smartphone',
    keywords: ['smartphone', 'phone', 'mobile phone', 'camera lens', 'phone case'],
  },
  'streaming-device-comparison': {
    catalogSearch: 'tv box',
    keywords: ['tv box', 'chromecast', 'fire stick', 'streaming', 'android tv', 'remote'],
  },
  'gaming-mouse-buying-guide': {
    catalogSearch: 'gaming mouse',
    keywords: ['gaming mouse', 'mouse', 'wireless mouse', 'mouse pad'],
  },
  'external-ssd-vs-hdd': {
    catalogSearch: 'external ssd',
    keywords: ['ssd', 'hard drive', 'external drive', 'portable ssd', 'usb storage'],
  },
  'tablet-vs-laptop-students': {
    catalogSearch: 'tablet',
    keywords: ['tablet', 'ipad', 'laptop', 'stylus', 'keyboard case', 'notebook'],
  },
  'smartwatch-fitness-sensors': {
    catalogSearch: 'smart watch',
    keywords: ['smart watch', 'smartwatch', 'fitness tracker', 'band', 'wearable'],
  },
  'inkjet-vs-laser-printers': {
    catalogSearch: 'printer',
    keywords: ['printer', 'ink cartridge', 'toner', 'scanner'],
  },
  'guide-ai-2026': {
    catalogSearch: 'ai gadget',
    keywords: ['smart speaker', 'ai', 'gadget', 'electronics', 'assistant'],
  },
  'guide-css-2026': {
    catalogSearch: 'monitor',
    keywords: ['monitor', 'keyboard', 'desk', 'laptop', 'webcam'],
  },
  'smart-home-setup-2026': {
    catalogSearch: 'smart home',
    keywords: ['smart home', 'smart plug', 'bulb', 'sensor', 'hub', 'alexa', 'google home'],
  },
  'ai-tools-save-time-2026': {
    catalogSearch: 'laptop',
    keywords: ['laptop', 'keyboard', 'webcam', 'microphone', 'headphone', 'monitor', 'tablet'],
  },
  'chatgpt-vs-gemini-vs-claude': {
    catalogSearch: 'electronics',
    keywords: ['laptop', 'tablet', 'phone', 'keyboard', 'monitor', 'smart speaker'],
  },
  'make-money-online-2026': {
    catalogSearch: 'laptop',
    keywords: ['laptop', 'webcam', 'microphone', 'ring light', 'keyboard', 'monitor', 'headphone'],
  },
  'cybersecurity-threats-2026': {
    catalogSearch: 'security camera',
    keywords: ['security', 'router', 'password', 'webcam cover', 'smart lock', 'vpn'],
  },
  'beginner-blog-making-money': {
    catalogSearch: 'laptop',
    keywords: ['laptop', 'keyboard', 'webcam', 'microphone', 'monitor', 'ring light'],
  },
  'best-free-ai-websites-2026': {
    catalogSearch: 'laptop',
    keywords: ['laptop', 'tablet', 'keyboard', 'mouse', 'headphone', 'webcam'],
  },
  'rank-new-website-google-2026': {
    catalogSearch: 'laptop',
    keywords: ['laptop', 'keyboard', 'monitor', 'webcam', 'router', 'ssd'],
  },
  'passive-income-ideas-2026': {
    catalogSearch: 'laptop',
    keywords: ['laptop', 'printer', 'webcam', 'microphone', 'tablet', 'monitor'],
  },
  'best-chrome-extensions-2026': {
    catalogSearch: 'laptop',
    keywords: ['laptop', 'keyboard', 'mouse', 'monitor', 'webcam', 'headphone'],
  },
  'protect-personal-data-online': {
    catalogSearch: 'security camera',
    keywords: ['router', 'security', 'webcam', 'smart lock', 'vpn', 'password'],
  },
};

/** Legacy Firestore docs that were published before seedKey existed. */
export const LEGACY_BLOG_IMAGE_FIXES = {
  NiGcSKKYf30ahRo8mpN0: { seedKey: 'guide-ai-2026', image: '/images/blog/guide-ai-2026.webp' },
  RnThPVJ3d2dEEDKZVFBw: { seedKey: 'smart-home-setup-2026', image: '/images/blog/smart-home-setup-2026.webp' },
  et6oKdCR5x6jSMfEqHbO: { seedKey: 'guide-css-2026', image: '/images/blog/guide-css-2026.webp' },
};

export function getArticleProductConfig(post) {
  if (!post) {
    return { catalogSearch: 'tech', keywords: ['tech', 'gadget', 'electronics'] };
  }

  if (post.seedKey && ARTICLE_PRODUCT_MAP[post.seedKey]) {
    return ARTICLE_PRODUCT_MAP[post.seedKey];
  }

  const tags = (post.tags || []).filter(Boolean);
  if (tags.length > 0) {
    return {
      catalogSearch: tags[0],
      keywords: tags.map((t) => t.toLowerCase()),
    };
  }

  // Derive search terms from the title so unmapped articles still get relevant picks
  const titleWords = String(post.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s+]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !['with', 'from', 'that', 'this', 'your', 'what', 'when', 'guide', 'best', 'complete', 'ultimate'].includes(w));

  const catalogSearch = titleWords.slice(0, 3).join(' ') || 'tech gadgets';
  return {
    catalogSearch,
    keywords: titleWords.length ? titleWords.slice(0, 8) : ['tech', 'gadget', 'electronics'],
  };
}
