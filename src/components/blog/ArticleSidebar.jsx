import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { resolveBlogImage, estimateReadingTime } from '../../utils/blogUtils';
import { getBuyLink } from '../../utils/productLinks';

export function ArticleSidebar({ relatedArticles, relatedProducts, productsLoading }) {
  const hasArticles = relatedArticles?.length > 0;
  const hasProducts = relatedProducts?.length > 0;

  return (
    <aside className="space-y-5 lg:sticky lg:top-[6.75rem] lg:max-h-[calc(100vh-7.25rem)] lg:overflow-y-auto lg:pb-8 lg:pr-1">
      {/* Journal */}
      <section className="rounded-lg border border-stone-200 bg-white p-3.5">
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">
          More to read
        </h2>
        {hasArticles ? (
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
        ) : (
          <p className="text-[12px] text-stone-500">No related articles yet.</p>
        )}
        <Link
          to="/blog"
          className="mt-3.5 flex w-full items-center justify-center gap-1 rounded-md border border-stone-200 bg-stone-50 py-2 text-[12px] font-semibold text-stone-800 transition-colors hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800"
        >
          Show more <ArrowRight size={12} />
        </Link>
      </section>

      {/* Store products */}
      <section className="rounded-lg border border-stone-200 bg-white p-3.5">
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">
          From the store
        </h2>
        {hasProducts ? (
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
        ) : (
          <p className="text-[12px] text-stone-500">
            {productsLoading ? 'Loading products…' : 'No matching products yet.'}
          </p>
        )}
        <Link
          to="/catalog"
          className="mt-3.5 flex w-full items-center justify-center gap-1 rounded-md border border-stone-200 bg-stone-50 py-2 text-[12px] font-semibold text-stone-800 transition-colors hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800"
        >
          Show more <ArrowRight size={12} />
        </Link>
      </section>
    </aside>
  );
}
