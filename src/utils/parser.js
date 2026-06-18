/**
 * Real automated product data fetcher using multiple CORS proxies for reliability.
 * Fetches actual HTML from the provided URL and parses metadata using DOM selectors.
 */

export const fetchProductDataFromUrl = async (url, options = {}) => {
  const { triedEnglish = false } = options;
  const isLive = typeof window !== 'undefined' && !/(localhost|127\.0\.0\.1|0\.0\.0\.0)/.test(window.location.hostname);

  const buildProxyUrl = (u) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`;
  const buildCorsProxyUrl = (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`;
  const buildCodetabsUrl = (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`;

  const proxies = [buildProxyUrl, buildCorsProxyUrl, buildCodetabsUrl];

  const fetchHtml = async (targetUrl, useServerProxy = false) => {
    if (useServerProxy) {
      const response = await fetch(`/api/scrape?target=${encodeURIComponent(targetUrl)}`, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) throw new Error(`Server proxy fetch failed: ${response.status}`);
      return response.text();
    }

    return Promise.any(proxies.map(async (getProxyUrl) => {
      const proxyUrl = getProxyUrl(targetUrl);
      const response = await fetch(proxyUrl, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
        },
      });

      if (!response.ok) throw new Error(`Proxy returned status ${response.status}`);
      if (proxyUrl.includes('allorigins.win')) {
        const data = await response.json();
        return data.contents;
      }
      return response.text();
    }));
  };

  const parseHtml = async (htmlString) => {
    if (!htmlString) throw new Error('Empty response from proxy');

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const redirectLink = doc.querySelector('a[href*="aliexpress.com/item/"]');
    if (redirectLink && url.includes('s.click.aliexpress.com')) {
      console.log('Found redirect link, fetching again:', redirectLink.href);
      return fetchProductDataFromUrl(redirectLink.href, { triedEnglish });
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
      ]
    };

    const extract = (key) => {
      for (const selector of selectors[key]) {
        const el = doc.querySelector(selector);
        if (!el) continue;
        if (selector.startsWith('meta')) return el.getAttribute('content');
        if (selector.startsWith('link')) return el.getAttribute('href');
        if (key === 'image' && el.tagName === 'IMG') return el.getAttribute('src');
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
      affiliateLink: ogUrl || canonical || url
    };

    result.description = result.description.replace(/\s\s+/g, ' ').substring(0, 500);

    const italianHint = /(caratteristiche|prezzo|spedizione|prodotto|offerta|scegli|recensione|opzioni)/i;
    if (!triedEnglish && italianHint.test(`${result.title} ${result.description}`)) {
      return fetchProductDataFromUrl(url, { triedEnglish: true });
    }

    return result;
  };

  try {
    const htmlString = await fetchHtml(url, isLive);
    const result = await parseHtml(htmlString);

    if (result.price === '0.00' || !result.price) {
      const priceMatch = htmlString.match(/"formatedAmount":"([^"]+)"/);
      if (priceMatch) result.price = priceMatch[1].replace(/[^0-9.]/g, '');
    }

    return result;
  } catch (err) {
    if (isLive) {
      try {
        const htmlString = await fetchHtml(url, false);
        return await parseHtml(htmlString);
      } catch (fallbackErr) {
        console.warn('Fallback to public proxy failed:', fallbackErr);
      }
    }
    throw new Error(`Failed to extract data: ${err.message || 'CORS proxy error'}`);
  }
};

