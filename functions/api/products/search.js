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

  const keywords = url.searchParams.get("keywords") || "gadgets";
  const pageNo = url.searchParams.get("page_no") || "1";
  const pageSize = url.searchParams.get("page_size") || "20";

  const params = {
    app_key: APP_KEY,
    method: "aliexpress.affiliate.product.query",
    timestamp: getAliExpressTimestamp(),
    format: "json",
    v: "2.0",
    sign_method: "md5",
    keywords: keywords,
    page_no: pageNo,
    page_size: pageSize
  };

  params.sign = generateAliExpressSign(params, appSecret);

  const targetUrl = new URL("https://api-sg.aliexpress.com/sync");
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
      error: "Failed to fetch search catalog",
      details: err.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
