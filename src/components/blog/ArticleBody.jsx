import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Tag } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

// Reading-optimised prose: comfortable 17px body with 1.75 line-height,
// clear paragraph rhythm, and an elevated heading hierarchy. Colour is
// reserved for links only; emphasis uses weight, not hue.
const PROSE_CLASSES = [
  'text-[17px] leading-[1.75] text-slate-700',
  '[&_p]:mb-6',
  '[&_h1]:mt-14 [&_h1]:mb-4 [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:text-slate-900',
  '[&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:text-[1.75rem] [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-slate-900',
  '[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-slate-900',
  '[&_h2+p]:mt-0 [&_h3+p]:mt-0',
  '[&_strong]:font-semibold [&_strong]:text-slate-900',
  '[&_ul]:my-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:marker:text-slate-400',
  '[&_ol]:my-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_ol]:marker:text-slate-400',
  '[&_li]:pl-1.5 [&_li]:leading-[1.7]',
  '[&_a]:font-medium [&_a]:text-amber-600 [&_a]:underline [&_a]:decoration-amber-600/30 [&_a]:underline-offset-2 [&_a:hover]:decoration-amber-600',
  '[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-300 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-slate-600',
  '[&_hr]:my-10 [&_hr]:border-slate-200',
].join(' ');

export function ArticleBody({ post }) {
  return (
    <article className="mx-auto mb-20 max-w-[720px]">
      <div className={PROSE_CLASSES}>
        <ReactMarkdown components={{ code: CodeBlock }}>{post.content}</ReactMarkdown>

        {post.category && (
          <p className="mb-6">
            Ready to see this in action? Browse our full, hand-picked{' '}
            <Link
              to={`/catalog?cat=${encodeURIComponent(post.category)}`}
              className="font-medium text-amber-600 hover:underline"
            >
              {post.category} collection
            </Link>{' '}
            for verified deals from official stores.
          </p>
        )}
      </div>

      <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-200 pt-10">
        {['Gadgets', 'Tech', 'Innovation', 'Review'].map((tag) => (
          <span
            key={tag}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-500 transition-colors hover:border-amber-400 hover:text-amber-600"
          >
            <Tag size={11} /> {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
