export function encodeProductParam(obj) {
  return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(obj)))));
}

export function decodeProductParam(d) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(d)))));
  } catch {
    try { return JSON.parse(atob(decodeURIComponent(d))); } catch { return null; }
  }
}

export function productDetailUrl(product) {
  const pid = product.product_id || product.id;
  try {
    const payload = encodeProductParam({
      id:                     pid,
      product_id:             product.product_id,
      product_title:          product.product_title || product.title,
      product_main_image_url: product.product_main_image_url || product.image,
      product_small_image_urls: product.product_small_image_urls || [],
      target_sale_price:      product.target_sale_price || product.price,
      original_price:         product.original_price,
      evaluate_rate:          product.evaluate_rate || product.rating,
      promotion_link:         product.promotion_link,
      merchant:               product.merchant,
      first_level_category_name: product.first_level_category_name || product.category,
      description:            product.description,
    });
    return `/product/${pid}?d=${payload}`;
  } catch {
    return `/product/${pid}`;
  }
}
