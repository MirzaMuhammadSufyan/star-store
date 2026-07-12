import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import { Tag } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { isEditorialCategory } from '../../utils/blogCategories';
import { getArticleProductConfig } from '../../utils/articleProductMap';

// Compact reading measure: Georgia at ~16.5px with tighter section rhythm
// so long articles feel dense and scannable, not oversized.
const PROSE_CLASSES = [
  'article-prose text-[16.5px] leading-[1.7] text-stone-800',
  '[&_p]:mb-4',
  '[&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:text-[1.35rem] [&_h1]:font-bold [&_h1]:leading-snug [&_h1]:text-stone-900',
  '[&_h2]:mt-8 [&_h2]:mb-2.5 [&_h2]:text-[1.2rem] [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:text-stone-900',
  '[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-[1.05rem] [&_h3]:font-bold [&_h3]:leading-snug [&_h3]:text-stone-900',
  '[&_h2+p]:mt-0 [&_h3+p]:mt-0',
  '[&_strong]:font-bold [&_strong]:text-stone-900',
  '[&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:marker:text-stone-400',
  '[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_ol]:marker:text-stone-400',
  '[&_li]:pl-0.5 [&_li]:leading-[1.65]',
  '[&_a]:font-medium [&_a]:text-amber-700 [&_a]:underline [&_a]:decoration-amber-700/30 [&_a]:underline-offset-2 [&_a:hover]:decoration-amber-700',
  '[&_blockquote]:my-5 [&_blockquote]:border-l-[3px] [&_blockquote]:border-amber-300 [&_blockquote]:pl-4 [&_blockquote]:text-[15.5px] [&_blockquote]:italic [&_blockquote]:text-stone-600',
  '[&_hr]:my-7 [&_hr]:border-stone-200',
  '[&_img]:my-5 [&_img]:rounded-md',
  '[&_table]:my-5 [&_table]:w-full [&_table]:border-collapse [&_table]:text-[14.5px]',
  '[&_th]:border [&_th]:border-stone-200 [&_th]:bg-stone-50 [&_th]:px-2.5 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-bold',
  '[&_td]:border [&_td]:border-stone-200 [&_td]:px-2.5 [&_td]:py-1.5',
].join(' ');

const looksLikeHtml = (content) => /<\/?[a-z][\s\S]*>/i.test(content || '');

export function ArticleBody({ post }) {
  const content = post.content || '';
  const tags = post.tags?.length ? post.tags : [];
  const productConfig = getArticleProductConfig(post);

  return (
    <article className="mb-10">
      {looksLikeHtml(content) ? (
        <div
          className={PROSE_CLASSES}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
        />
      ) : (
        <div className={PROSE_CLASSES}>
          <ReactMarkdown components={{ code: CodeBlock }}>{content}</ReactMarkdown>
        </div>
      )}

      {post.category && isEditorialCategory(post.category) ? (
        <p className="article-prose mt-6 border-t border-stone-200 pt-5 text-[15px] leading-relaxed text-stone-700">
          Explore more in{' '}
          <Link to="/blog" className="font-medium text-amber-700 underline decoration-amber-700/30 underline-offset-2 hover:decoration-amber-700">
            The Journal
          </Link>
          , or return to the{' '}
          <Link to="/" className="font-medium text-amber-700 underline decoration-amber-700/30 underline-offset-2 hover:decoration-amber-700">
            storefront
          </Link>
          .
        </p>
      ) : post.category ? (
        <p className="article-prose mt-6 border-t border-stone-200 pt-5 text-[15px] leading-relaxed text-stone-700">
          Shopping for {productConfig.catalogSearch}? See our{' '}
          <Link
            to={`/catalog?cat=${encodeURIComponent(productConfig.catalogSearch)}`}
            className="font-medium text-amber-700 underline decoration-amber-700/30 underline-offset-2 hover:decoration-amber-700"
          >
            {productConfig.catalogSearch} picks
          </Link>
          .
        </p>
      ) : null}

      {tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-1.5 border-t border-stone-200 pt-5">
          {tags.map((tag) => (
            <Link
              key={tag}
              to={`/blog?tag=${encodeURIComponent(tag)}`}
              className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-[11px] text-stone-600 transition-colors hover:border-amber-400 hover:text-amber-700"
            >
              <Tag size={10} /> {tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
