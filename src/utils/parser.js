/**
 * Real automated product data fetcher using multiple CORS proxies for reliability.
 * Fetches actual HTML from the provided URL and parses metadata using DOM selectors.
 */

export const fetchProductDataFromUrl = async (url) => {
  const proxies = [
    (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    (u) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
    (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`
  ];

  let lastError = null;

  for (const getProxyUrl of proxies) {
    try {
      const proxyUrl = getProxyUrl(url);
      const response = await fetch(proxyUrl);
      
      if (!response.ok) throw new Error(`Proxy returned status ${response.status}`);
      
      let htmlString = '';
      
      // AllOrigins returns JSON, corsproxy.io returns text
      if (proxyUrl.includes('allorigins.win')) {
        const data = await response.json();
        htmlString = data.contents;
      } else {
        htmlString = await response.text();
      }

      if (!htmlString) throw new Error('Empty response from proxy');

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');

      // Extraction Logic (AliExpress, Amazon, Apple, General OpenGraph)
      const selectors = {
        title: [
          'h1[data-pl="product-title"]',
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
          '.price-default--current--F8OlYIo',
          '.a-price-whole',
          '.product-price',
          'span.price',
          'meta[property="product:price:amount"]'
        ],
        image: [
          'img.magnifier--image--RM17RL2',
          '.slider--img--kD4mIg7 img',
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
      console.warn(`Proxy failed (${getProxyUrl(url)}):`, err);
      lastError = err;
      continue; // Try next proxy
    }
  }

  throw new Error(`Failed to extract data: ${lastError?.message || 'CORS proxy error'}. AliExpress links might require manual entry if proxies are blocked.`);
};
