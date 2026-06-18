/**
 * Real automated product data fetcher using multiple CORS proxies for reliability.
 * Fetches actual HTML from the provided URL and parses metadata using DOM selectors.
 */

export const fetchProductDataFromUrl = async (url) => {
  const proxies = [
    (u) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
    (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`
  ];

  let lastError = null;

  for (const getProxyUrl of proxies) {
    try {
      const proxyUrl = getProxyUrl(url);
      const response = await fetch(proxyUrl);
      
      if (!response.ok) throw new Error(`Proxy returned status ${response.status}`);
      
      let htmlString = '';
      
      if (proxyUrl.includes('allorigins.win')) {
        const data = await response.json();
        htmlString = data.contents;
      } else {
        htmlString = await response.text();
      }

      if (!htmlString) throw new Error('Empty response from proxy');

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');

      // If it's a short URL, it might just contain a meta redirect, a script redirect, or a simple link
      if (url.includes('s.click.aliexpress.com')) {
          const redirectLink = doc.querySelector('a[href*="aliexpress.com/item/"]');
          if (redirectLink) {
              return fetchProductDataFromUrl(redirectLink.href);
          }

          // Try to find URL in scripts or meta tags
          const metaRefresh = doc.querySelector('meta[http-equiv="refresh"]');
          if (metaRefresh) {
              const content = metaRefresh.getAttribute('content');
              const match = content.match(/url=(.*)/i);
              if (match && match[1]) return fetchProductDataFromUrl(match[1]);
          }

          const scriptMatch = htmlString.match(/window\.location\.replace\(['"]([^'"]+)['"]\)/) ||
                             htmlString.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
          if (scriptMatch && scriptMatch[1]) {
              return fetchProductDataFromUrl(scriptMatch[1]);
          }
      }

      const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
      const ogUrl = doc.querySelector('meta[property="og:url"]')?.getAttribute('content');

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
        ],
        images: [
           '.slider--img--kD4mIg7 img',
           '#altImages img',
           '.imgTagWrapper img',
           '.magnifier--image--RM17RL2'
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

      const extractImages = () => {
        const imgs = new Set();
        for (const selector of selectors.images) {
          const elements = doc.querySelectorAll(selector);
          elements.forEach(el => {
            const src = el.getAttribute('src') || el.getAttribute('data-src') || el.getAttribute('data-old-hires');
            if (src && src.startsWith('http')) {
                imgs.add(src);
            }
          });
        }
        return Array.from(imgs);
      };

      const allImages = extractImages();
      const mainImage = extract('image') || allImages[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30';

      const result = {
        title: extract('title') || 'New Product',
        description: extract('description') || 'No description available',
        price: extract('price').replace(/[^0-9.]/g, '') || '0.00',
        image: mainImage,
        images: allImages.length > 0 ? allImages : [mainImage],
        category: 'Electronics',
        affiliateLink: ogUrl || canonical || url
      };

      result.description = result.description.replace(/\s\s+/g, ' ').substring(0, 500);

      if (result.price === '0.00' || !result.price) {
          const priceMatch = htmlString.match(/"formatedAmount":"([^"]+)"/);
          if (priceMatch) result.price = priceMatch[1].replace(/[^0-9.]/g, '');
      }

      return result;
    } catch (err) {
      console.warn(`Proxy failed (${getProxyUrl(url)}):`, err);
      lastError = err;
      continue;
    }
  }

  throw new Error(`Failed to extract data: ${lastError?.message || 'CORS proxy error'}. AliExpress links might require manual entry if proxies are blocked.`);
};
