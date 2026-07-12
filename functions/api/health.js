import { corsHeaders } from './products/_utils.js';

/**
 * Public (non-secret) status of affiliate Worker configuration.
 * Never returns secret values — only whether they are present.
 */
export async function onRequestGet(context) {
  const { env } = context;
  const appSecret = Boolean(env.ALIEXPRESS_APP_SECRET);
  const trackingId = Boolean(env.ALIEXPRESS_TRACKING_ID);

  return new Response(
    JSON.stringify({
      ok: appSecret && trackingId,
      aliexpress: {
        appSecretConfigured: appSecret,
        trackingIdConfigured: trackingId,
      },
      hint: !appSecret || !trackingId
        ? 'Set ALIEXPRESS_APP_SECRET and ALIEXPRESS_TRACKING_ID via: npx wrangler secret put <NAME>'
        : null,
    }),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        'content-type': 'application/json',
        'cache-control': 'no-store',
      },
    },
  );
}
