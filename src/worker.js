import { onRequest as syncHandler } from '../functions/api/products/sync.js';
import { onRequestGet as searchHandler } from '../functions/api/products/search.js';
import { onRequestGet as detailHandler } from '../functions/api/products/detail.js';
import { onRequest as oauthCallbackHandler } from '../functions/oauth/callback.js';
import { onRequest as scrapeHandler } from '../functions/scrape.js';
import { corsHeaders } from '../functions/api/products/_utils.js';

function withCors(response) {
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => headers.set(key, value));
  return new Response(response.body, { status: response.status, headers });
}

const apiRoutes = {
  '/api/products/sync': syncHandler,
  '/api/products/search': searchHandler,
  '/api/products/detail': detailHandler
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path in apiRoutes) {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
      }
      try {
        const response = await apiRoutes[path]({ request, env, ctx });
        return withCors(response);
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'content-type': 'application/json' }
        });
      }
    }

    if (path === '/oauth/callback') {
      return oauthCallbackHandler({ request, env, ctx });
    }

    if (path === '/scrape') {
      return scrapeHandler({ request, env, ctx });
    }

    return env.ASSETS.fetch(request);
  }
};
