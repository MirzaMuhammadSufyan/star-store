import { BadgeCheck } from 'lucide-react';
import { authorInitials, resolveAuthor } from '../../content/authors';

export function AuthorBio({ post }) {
  const author = resolveAuthor(post);
  if (!author.bio && !author.credentials) return null;

  return (
    <aside
      className="mx-auto mb-16 max-w-[720px] rounded-xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6"
      aria-label={`About the author, ${author.name}`}
    >
      <div className="flex items-start gap-4">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt=""
            className="h-14 w-14 shrink-0 rounded-full object-cover border border-slate-200"
          />
        ) : (
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-800"
            aria-hidden
          >
            {authorInitials(author.name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-700">
            About the author
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{author.name}</h2>
          {author.role && (
            <p className="mt-0.5 text-sm font-medium text-slate-500">{author.role}</p>
          )}
          {author.bio && (
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{author.bio}</p>
          )}
          {author.credentials && (
            <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
              <BadgeCheck size={14} className="mt-0.5 shrink-0 text-amber-600" />
              <span>{author.credentials}</span>
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
