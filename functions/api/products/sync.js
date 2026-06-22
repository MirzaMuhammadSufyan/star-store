import { callAliExpressApi } from '../../utils/aliexpress.js';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const categoryId = url.searchParams.get('category_id');
  const keywords = url.searchParams.get('keywords');
  const pageNo = url.searchParams.get('page_no') || '1';
  const pageSize = url.searchParams.get('page_size') || '20';

  if (!categoryId && !keywords) {
    return new Response(JSON.stringify({ error: 'Missing category_id or keywords parameter' }), {
      status: 400,
      headers: { 'content-type': 'application/json' }
    });
  }

  const apiParams = {
    method: 'aliexpress.affiliate.product.query',
    page_no: pageNo,
    page_size: pageSize,
    target_currency: 'USD',
    target_language: 'EN',
    tracking_id: env.ALIEXPRESS_TRACKING_ID || 'default'
  };

  if (categoryId) apiParams.category_ids = categoryId;
  if (keywords) apiParams.keywords = keywords;

  try {
    const data = await callAliExpressApi('aliexpress.affiliate.product.query', apiParams, env);

    // AliExpress response structure is often deeply nested
    // aliexpress_affiliate_product_query_response -> resp_result -> result -> products -> product
    const responseRoot = data.aliexpress_affiliate_product_query_response || data.error_response;

    if (data.error_response || (responseRoot && responseRoot.resp_result && responseRoot.resp_result.resp_code !== 200)) {
      return new Response(JSON.stringify({
        error: 'AliExpress API returned an error',
        details: responseRoot
      }), {
        status: 502,
        headers: { 'content-type': 'application/json' }
      });
    }

    const products = responseRoot?.resp_result?.result?.products?.product || [];

    const mappedProducts = products.map(product => ({
      product_id: product.product_id,
      product_title: product.product_title,
      target_sale_price: product.target_sale_price,
      promotion_link: product.promotion_link,
      product_main_image_url: product.product_main_image_url,
      evaluate_rate: product.evaluate_rate,
      original_price: product.original_price,
      second_level_category_name: product.second_level_category_name,
      shop_id: product.shop_id,
      shop_url: product.shop_url
    }));

    return new Response(JSON.stringify({
      success: true,
      count: mappedProducts.length,
      products: mappedProducts
    }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}
