import { APP_KEY, getAliExpressTimestamp, generateAliExpressSign, corsHeaders } from './_utils.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const appSecret = env.ALIEXPRESS_APP_SECRET;
  if (!appSecret) {
    return new Response(JSON.stringify({ error: 'ALIEXPRESS_APP_SECRET is not configured' }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const productIds = url.searchParams.get("product_ids");
  if (!productIds) {
    return new Response(JSON.stringify({ error: "Missing required parameter: product_ids" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const params = {
    app_key: APP_KEY,
    method: "aliexpress.affiliate.product.detail.get",
    timestamp: getAliExpressTimestamp(),
    format: "json",
    v: "2.0",
    sign_method: "md5",
    product_ids: productIds
  };

  params.sign = generateAliExpressSign(params, appSecret);

  const targetUrl = new URL("https://eco.aliexpress.com/router/rest");
  Object.keys(params).forEach(k => targetUrl.searchParams.append(k, params[k]));

  try {
    const response = await fetch(targetUrl.toString());
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: "Failed to fetch advanced product details",
      details: err.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
