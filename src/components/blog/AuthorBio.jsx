import { BadgeCheck } from 'lucide-react';
import { authorInitials, resolveAuthor } from '../../content/authors';

export function AuthorBio({ post }) {
  const author = resolveAuthor(post);
  if (!author.bio && !author.credentials) return null;

  return (
    <aside
      className="mb-10 rounded-lg border border-stone-200 bg-stone-50/90 px-4 py-3.5 sm:px-5"
      aria-label={`About the author, ${author.name}`}
    >
      <div className="flex items-start gap-3">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full border border-stone-200 object-cover"
          />
        ) : (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800"
            aria-hidden
          >
            {authorInitials(author.name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700">
            Author
          </p>
          <h2 className="mt-0.5 text-[15px] font-semibold text-stone-900">
            {author.name}
            {author.role ? (
              <span className="ml-1.5 font-normal text-stone-500">· {author.role}</span>
            ) : null}
          </h2>
          {author.bio && (
            <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">{author.bio}</p>
          )}
          {author.credentials && (
            <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-stone-500">
              <BadgeCheck size={13} className="mt-0.5 shrink-0 text-amber-600" />
              <span>{author.credentials}</span>
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
