import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import { Tag } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { isEditorialCategory } from '../../utils/blogCategories';
import { getArticleProductConfig } from '../../utils/articleProductMap';

// Reading-optimised prose: Georgia (standard long-form reading face),
// comfortable 18px body with 1.8 line-height. Colour is reserved for
// links only; emphasis uses weight, not hue.
const PROSE_CLASSES = [
  'article-prose text-[1.125rem] leading-[1.8] text-slate-800',
  '[&_p]:mb-6',
  '[&_h1]:mt-14 [&_h1]:mb-4 [&_h1]:text-[2rem] [&_h1]:font-bold [&_h1]:leading-snug [&_h1]:tracking-normal [&_h1]:text-slate-900',
  '[&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:text-[1.5rem] [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:tracking-normal [&_h2]:text-slate-900',
  '[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-[1.25rem] [&_h3]:font-bold [&_h3]:leading-snug [&_h3]:text-slate-900',
  '[&_h2+p]:mt-0 [&_h3+p]:mt-0',
  '[&_strong]:font-bold [&_strong]:text-slate-900',
  '[&_ul]:my-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:marker:text-slate-400',
  '[&_ol]:my-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_ol]:marker:text-slate-400',
  '[&_li]:pl-1.5 [&_li]:leading-[1.8]',
  '[&_a]:font-medium [&_a]:text-amber-700 [&_a]:underline [&_a]:decoration-amber-700/30 [&_a]:underline-offset-2 [&_a:hover]:decoration-amber-700',
  '[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-300 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-slate-600',
  '[&_hr]:my-10 [&_hr]:border-slate-200',
  '[&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:text-[1rem]',
  '[&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-bold',
  '[&_td]:border [&_td]:border-slate-200 [&_td]:px-3 [&_td]:py-2',
].join(' ');

// Rich-text posts from the WYSIWYG editor are stored as HTML; older posts
// are Markdown strings. Detect an HTML tag to decide how to render.
const looksLikeHtml = (content) => /<\/?[a-z][\s\S]*>/i.test(content || '');

export function ArticleBody({ post }) {
  const content = post.content || '';
  const tags = post.tags?.length ? post.tags : [];
  const productConfig = getArticleProductConfig(post);

  return (
    <article className="mx-auto mb-20 max-w-[720px]">
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
        <p className="article-prose mt-8 text-[1.125rem] leading-[1.8] text-slate-800">
          Explore more perspectives in{' '}
          <Link
            to="/blog"
            className="font-medium text-amber-700 underline decoration-amber-700/30 underline-offset-2 hover:decoration-amber-700"
          >
            The Journal
          </Link>
          , or return to the{' '}
          <Link
            to="/"
            className="font-medium text-amber-700 underline decoration-amber-700/30 underline-offset-2 hover:decoration-amber-700"
          >
            storefront
          </Link>
          .
        </p>
      ) : post.category ? (
        <p className="article-prose mt-8 text-[1.125rem] leading-[1.8] text-slate-800">
          Ready to shop for {productConfig.catalogSearch}? Browse our hand-picked{' '}
          <Link
            to={`/catalog?cat=${encodeURIComponent(productConfig.catalogSearch)}`}
            className="font-medium text-amber-700 underline decoration-amber-700/30 underline-offset-2 hover:decoration-amber-700"
          >
            {productConfig.catalogSearch} deals
          </Link>{' '}
          — verified picks that match what this guide covers.
        </p>
      ) : null}

      {tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-200 pt-10">
          {tags.map((tag) => (
            <Link
              key={tag}
              to={`/blog?tag=${encodeURIComponent(tag)}`}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-500 transition-colors hover:border-amber-400 hover:text-amber-600"
            >
              <Tag size={11} /> {tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
