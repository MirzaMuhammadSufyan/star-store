/**
 * Canonical public site URL — keep in sync with prerender SITE_URL / VITE_SITE_URL.
 * Strip trailing slash so callers can safely append paths.
 */
const raw =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) ||
  'https://star-store.mirzamuhammadsufyanbaig.workers.dev';

export const SITE_NAME = 'Star Store';
export const SITE_URL = String(raw).replace(/\/$/, '');

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
