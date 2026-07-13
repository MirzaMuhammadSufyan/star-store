import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ExternalLink, Star } from 'lucide-react';
import { resolveBlogImage, estimateReadingTime } from '../../utils/blogUtils';
import { getBuyLink } from '../../utils/productLinks';
import { productDetailUrl } from '../../utils/productUrl';
import { useAnalyticsStore } from '../../store/analyticsStore';

function SidebarProductCard({ product }) {
  const logClick = useAnalyticsStore((s) => s.logClick);
  const title = product.product_title || product.title;
  const image = product.product_main_image_url || product.image;
  const price = product.target_sale_price || product.price;
  const origPrice = product.original_price;
  const rating = product.evaluate_rate || product.rating || '4.8';
  const merchant = product.merchant || 'AliExpress';
  const buyLink = getBuyLink(product);
  const pid = product.product_id || product.id;

  const discount = (() => {
    if (!origPrice || !price) return 0;
    const orig = parseFloat(origPrice);
    const cur = parseFloat(price);
    return orig > cur ? Math.round(((orig - cur) / orig) * 100) : 0;
  })();

  const handleBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!buyLink || buyLink === '#') return;
    if (buyLink.startsWith('http')) {
      logClick(pid, merchant, { via: 'article-sidebar' });
      window.open(buyLink, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = buyLink;
    }
  };

  return (
    <li
      data-sidebar-product
      className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-card transition-all hover:border-amber-300 hover:shadow-lift"
    >
      <Link
        to={productDetailUrl(product)}
        className="relative block aspect-square overflow-hidden bg-stone-50"
      >
        <img
          src={image}
          alt={title}
          className="h-full w-full object-contain p-2.5 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
            -{discount}%
          </span>
        )}
      </Link>

      <div className="flex flex-col gap-1.5 p-3">
        <Link to={productDetailUrl(product)}>
          <h3 className="line-clamp-2 min-h-[2.6em] text-[13px] font-semibold leading-snug text-stone-900 transition-colors group-hover:text-amber-800">
            {title}
          </h3>
        </Link>

        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={11}
              className={
                parseFloat(rating) >= i
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-stone-200 text-stone-200'
              }
            />
          ))}
          <span className="ml-1 text-[11px] text-stone-500">{rating}</span>
        </div>

        <div className="mt-0.5 flex items-end justify-between gap-2">
          <div>
            <p className="text-[15px] font-bold leading-none text-stone-900">
              ${parseFloat(price || 0).toFixed(2)}
            </p>
            {origPrice && (
              <p className="mt-1 text-[11px] leading-none text-stone-400 line-through">
                ${parseFloat(origPrice).toFixed(2)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleBuy}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-soft transition-colors hover:bg-amber-600"
            aria-label={`Buy ${title}`}
          >
            <ExternalLink size={13} />
          </button>
        </div>
      </div>
    </li>
  );
}

export function ArticleSidebar({ relatedArticles, relatedProducts, productsLoading }) {
  const hasArticles = relatedArticles?.length > 0;
  const hasProducts = relatedProducts?.length > 0;

  return (
    <div className="space-y-4">
      {/* Journal */}
      <section
        data-sidebar-articles
        className="rounded-lg border border-stone-200 bg-white p-3 shadow-card"
      >
        <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">
          More to read
        </h2>
        {hasArticles ? (
          <ul className="space-y-3">
            {relatedArticles.map((article) => (
              <li key={article.id}>
                <Link to={`/blog/${article.id}`} className="group flex gap-2.5">
                  <div className="h-14 w-[4.75rem] shrink-0 overflow-hidden rounded-md bg-stone-100">
                    <img
                      src={resolveBlogImage(article)}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[12.5px] font-semibold leading-snug text-stone-900 group-hover:text-amber-800">
                      {article.title}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-stone-500">
                      <Clock size={10} />
                      {estimateReadingTime(article.content)} min
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[12px] text-stone-500">No related articles yet.</p>
        )}
        <Link
          to="/blog"
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-md border border-stone-200 bg-stone-50 py-2 text-[12px] font-semibold text-stone-800 transition-colors hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800"
        >
          Show more <ArrowRight size={12} />
        </Link>
      </section>

      {/* Related products — count is fitted to article height by BlogPost */}
      <section
        data-sidebar-products
        className="rounded-lg border border-stone-200 bg-white p-3 shadow-card"
      >
        <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">
          Related products
        </h2>
        {hasProducts ? (
          <ul data-sidebar-product-list className="space-y-3">
            {relatedProducts.map((product) => (
              <SidebarProductCard
                key={product.product_id || product.id}
                product={product}
              />
            ))}
          </ul>
        ) : (
          <p className="text-[12px] text-stone-500">
            {productsLoading ? 'Loading products…' : 'No matching products yet.'}
          </p>
        )}
        <Link
          to="/catalog"
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-md border border-stone-200 bg-stone-50 py-2 text-[12px] font-semibold text-stone-800 transition-colors hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800"
        >
          Browse catalog <ArrowRight size={12} />
        </Link>
      </section>
    </div>
  );
}
