import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Tag } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

const PROSE_CLASSES = [
  'space-y-5 text-[16px] leading-[1.85] text-slate-700',
  '[&_h1]:mt-10 [&_h1]:mb-2 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-slate-900',
  '[&_h2]:mt-10 [&_h2]:mb-2 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900',
  '[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900',
  '[&_strong]:font-semibold [&_strong]:text-slate-900',
  '[&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2 [&_ul]:pl-2',
  '[&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-2 [&_ol]:pl-2',
  '[&_a]:font-medium [&_a]:text-amber-600 [&_a:hover]:underline',
].join(' ');

export function ArticleBody({ post }) {
  return (
    <article className="mx-auto mb-20 max-w-3xl">
      <div className={PROSE_CLASSES}>
        <ReactMarkdown components={{ code: CodeBlock }}>{post.content}</ReactMarkdown>

        {post.category && (
          <p>
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
