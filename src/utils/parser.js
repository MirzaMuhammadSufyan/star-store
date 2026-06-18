/**
 * Real automated product data fetcher using a CORS proxy.
 * Fetches actual HTML from the provided URL and parses metadata using DOM selectors.
 */

export const fetchProductDataFromUrl = async (url) => {
  try {
    // Validate URL
    new URL(url);

    // Using AllOrigins CORS proxy to fetch the HTML content
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) throw new Error('Failed to reach official store');

    const data = await response.json();
    const htmlString = data.contents;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Extraction Logic (Amazon, Apple, General OpenGraph)
    const selectors = {
      title: [
        '#productTitle',
        'h1.product-title',
        'meta[property="og:title"]',
        'title'
      ],
      description: [
        '#feature-bullets',
        'meta[property="og:description"]',
        'meta[name="description"]'
      ],
      price: [
        '.a-price-whole',
        '.product-price',
        'span.price',
        'meta[property="product:price:amount"]'
      ],
      image: [
        '#landingImage',
        'meta[property="og:image"]',
        'link[rel="image_src"]'
      ]
    };

    const extract = (key) => {
      for (const selector of selectors[key]) {
        const el = doc.querySelector(selector);
        if (!el) continue;

        if (selector.startsWith('meta')) {
          return el.getAttribute('content');
        }
        if (selector.startsWith('link')) {
          return el.getAttribute('href');
        }
        if (key === 'image' && el.tagName === 'IMG') {
          return el.getAttribute('src');
        }
        return el.innerText.trim();
      }
      return '';
    };

    const result = {
      title: extract('title') || 'New Product',
      description: extract('description') || 'No description available',
      price: extract('price').replace(/[^0-9.]/g, '') || '0.00',
      image: extract('image') || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      category: 'Electronics',
      affiliateLink: url
    };

    // Clean up description (remove excessive whitespace/newlines from bullets)
    result.description = result.description.replace(/\s\s+/g, ' ').substring(0, 500);

    return result;
  } catch (err) {
    console.error('Scraper Error:', err);
    throw new Error('Could not extract data from this link. Please fill the form manually.');
  }
};
