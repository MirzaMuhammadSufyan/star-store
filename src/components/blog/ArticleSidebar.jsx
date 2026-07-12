import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { resolveBlogImage, estimateReadingTime } from '../../utils/blogUtils';
import { getBuyLink } from '../../utils/productLinks';

export function ArticleSidebar({ relatedArticles, relatedProducts }) {
  const hasArticles = relatedArticles?.length > 0;
  const hasProducts = relatedProducts?.length > 0;
  if (!hasArticles && !hasProducts) return null;

  return (
    <aside className="space-y-6 lg:sticky lg:top-[5.25rem] lg:max-h-[calc(100vh-5.75rem)] lg:overflow-y-auto lg:pb-8 lg:pr-1">
      {hasArticles && (
        <section className="rounded-lg border border-stone-200 bg-white p-3.5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">
              More to read
            </h2>
            <Link to="/blog" className="text-[11px] font-medium text-amber-700 hover:underline">
              Journal
            </Link>
          </div>
          <ul className="space-y-3">
            {relatedArticles.map((article) => (
              <li key={article.id}>
                <Link to={`/blog/${article.id}`} className="group flex gap-2.5">
                  <div className="h-14 w-[4.5rem] shrink-0 overflow-hidden rounded bg-stone-100">
                    <img
                      src={resolveBlogImage(article)}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-stone-900 group-hover:text-amber-800">
                      {article.title}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-stone-500">
                      <Clock size={10} />
                      {estimateReadingTime(article.content)} min · {article.date}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasProducts && (
        <section className="rounded-lg border border-stone-200 bg-white p-3.5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">
              From the store
            </h2>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-0.5 text-[11px] font-medium text-amber-700 hover:underline"
            >
              Shop <ArrowRight size={11} />
            </Link>
          </div>
          <ul className="space-y-2.5">
            {relatedProducts.map((product) => {
              const title = product.product_title || product.title;
              const image = product.product_main_image_url || product.image;
              const price = product.target_sale_price || product.price;
              const buyLink = getBuyLink(product);
              const pid = product.product_id || product.id;
              const isExternal = buyLink.startsWith('http');
              return (
                <li
                  key={pid}
                  className="flex items-center gap-2.5 rounded-md border border-stone-100 bg-stone-50/80 p-2 transition-colors hover:border-amber-300 hover:bg-white"
                >
                  <Link to={`/product/${pid}`} className="h-12 w-12 shrink-0 overflow-hidden rounded bg-white">
                    <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${pid}`}>
                      <h3 className="line-clamp-2 text-[12px] font-medium leading-snug text-stone-800 hover:text-amber-700">
                        {title}
                      </h3>
                    </Link>
                    <p className="mt-0.5 text-[12px] font-semibold text-stone-900">
                      ${parseFloat(price || 0).toFixed(2)}
                    </p>
                  </div>
                  <a
                    href={buyLink}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'nofollow noopener' : undefined}
                    className="shrink-0"
                    aria-label={`Buy ${title}`}
                  >
                    <Button size="xs" variant="accent" className="gap-0.5 px-2">
                      <ExternalLink size={10} />
                    </Button>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </aside>
  );
}
