/**
 * Editorial author registry for E-E-A-T (Experience, Expertise, Authoritativeness, Trust).
 * Posts can override these fields via authorBio / authorRole / authorCredentials in Firestore.
 */
export const AUTHORS = {
  'Star Store Editorial': {
    name: 'Star Store Editorial',
    role: 'Editorial Team',
    bio: 'Star Store Editorial researches gadgets, compares real-world buying options, and publishes practical guides so shoppers can choose with confidence — not hype.',
    credentials:
      'Our desk reviews product specs against merchant listings, cross-checks pricing trends, and focuses on clear affiliate disclosures on every recommendation.',
  },
  'Mirza Muhammad Sufyan Baig': {
    name: 'Mirza Muhammad Sufyan Baig',
    role: 'Founder & Editor',
    bio: 'Founder of Star Store. Focuses on affiliate commerce, product discovery UX, and long-form tech journalism that helps readers buy smarter.',
    credentials:
      'Builds and operates Star Store end-to-end — catalog curation, Journal standards, and transparent affiliate linking practices.',
  },
};

export function resolveAuthor(post = {}) {
  const name = (post.author || 'Star Store Editorial').trim() || 'Star Store Editorial';
  const registered = AUTHORS[name] || null;

  return {
    name,
    role: (post.authorRole || registered?.role || 'Contributor').trim(),
    bio: (post.authorBio || registered?.bio || '').trim(),
    credentials: (post.authorCredentials || registered?.credentials || '').trim(),
    avatar: (post.authorAvatar || registered?.avatar || '').trim(),
  };
}

export function authorInitials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('') || 'SS';
}
