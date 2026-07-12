/**
 * Generate static HTML pages for crawlers (Google, AdSense, SEO tools).
 * React SPA serves empty <div id="root"> — this script writes real HTML
 * with article text so word-count tools and bots see content.
 *
 * Usage: node scripts/generate-prerender.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/prerender');
const SITE_URL = (
  process.env.SITE_URL ||
  process.env.VITE_SITE_URL ||
  'https://star-store.mirzamuhammadsufyanbaig.workers.dev'
).replace(/\/$/, '');

function loadEnvFile() {
  const envPath = resolve(__dirname, '../.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyDeYpQDX8a7Rt-j_5t8BdWX4jC3eRNJh9g',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'star-store-77521.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'star-store-77521',
};

function mdToHtml(md) {
  if (!md) return '';
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);
  html = html.replace(/\n\n/g, '</p><p>');
  html = `<p>${html}</p>`;
  html = html.replace(/<p><h/g, '<h').replace(/<\/h([1-3])><\/p>/g, '</h$1>');
  html = html.replace(/<p><ul>/g, '<ul>').replace(/<\/ul><\/p>/g, '</ul>');
  return html;
}

function pageShell({ title, description, canonical, body, extraHead = '' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description.replace(/"/g, '&quot;')}" />
  <link rel="canonical" href="${canonical}" />
  <meta name="robots" content="index, follow" />
  <style>
    body{font-family:Inter,system-ui,sans-serif;max-width:720px;margin:0 auto;padding:2rem 1.25rem;color:#334155;line-height:1.75}
    h1{font-size:2rem;color:#0f172a;line-height:1.2}
    h2{font-size:1.5rem;color:#0f172a;margin-top:2rem}
    h3{font-size:1.2rem;color:#0f172a;margin-top:1.5rem}
    a{color:#d97706}
    nav{margin-bottom:2rem;font-size:.9rem}
    .meta{color:#94a3b8;font-size:.875rem;margin-bottom:1.5rem}
    img{max-width:100%;border-radius:.75rem;margin:1.5rem 0}
  </style>
  ${extraHead}
</head>
<body>
  <nav><a href="${SITE_URL}/">Star Store</a> · <a href="${SITE_URL}/blog">Journal</a> · <a href="${SITE_URL}/catalog">Shop</a> · <a href="${SITE_URL}/about">About</a></nav>
  ${body}
  <footer style="margin-top:3rem;padding-top:1.5rem;border-top:1px solid #e2e8f0;font-size:.875rem;color:#94a3b8">
    <p>© Star Store · <a href="${SITE_URL}/legal/privacy">Privacy</a> · <a href="${SITE_URL}/legal/terms">Terms</a> · <a href="${SITE_URL}/contact">Contact</a></p>
  </footer>
</body>
</html>`;
}

async function fetchBlogs() {
  const { initializeApp } = await import('firebase/app');
  const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
  const { getFirestore, collection, getDocs, query, orderBy } = await import('firebase/firestore');

  const email = process.env.FIREBASE_EMAIL;
  const password = process.env.FIREBASE_PASSWORD;
  if (!email || !password) throw new Error('Set FIREBASE_EMAIL and FIREBASE_PASSWORD in .env');

  const app = initializeApp(firebaseConfig);
  await signInWithEmailAndPassword(getAuth(app), email, password);
  const snap = await getDocs(query(collection(getFirestore(app), 'blogs'), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function main() {
  mkdirSync(resolve(OUT, 'blog'), { recursive: true });

  const blogs = await fetchBlogs();
  const published = blogs.filter((b) => !b.status || b.status === 'published');
  const urls = [];

  for (const post of published) {
    const image = (post.image || post.coverImage || '').replace(/"/g, '');
    const body = `
      <article>
        <p class="meta">${post.category || 'Journal'} · ${post.author || 'Star Store Editorial'} · ${post.date || ''}</p>
        <h1>${post.title || 'Article'}</h1>
        <p><em>${post.excerpt || ''}</em></p>
        ${image ? `<img src="${SITE_URL}${image}" alt="${(post.title || '').replace(/"/g, '')}" width="800" height="450" />` : ''}
        <div class="content">${mdToHtml(post.content || '')}</div>
      </article>`;

    const html = pageShell({
      title: `${post.title} | Star Store`,
      description: post.excerpt || post.title,
      canonical: `${SITE_URL}/blog/${post.id}`,
      body,
    });

    writeFileSync(resolve(OUT, 'blog', `${post.id}.html`), html);
    urls.push({ loc: `${SITE_URL}/blog/${post.id}`, priority: '0.7' });
    console.log('Prerendered', post.id, '—', post.title?.slice(0, 50));
  }

  // Blog archive page
  const listItems = published
    .map(
      (p) =>
        `<li><a href="${SITE_URL}/blog/${p.id}"><strong>${p.title}</strong></a><br/><span style="color:#94a3b8">${p.excerpt || ''}</span></li>`,
    )
    .join('\n');

  writeFileSync(
    resolve(OUT, 'blog.html'),
    pageShell({
      title: 'The Journal | Star Store',
      description:
        'In-depth tech reviews, buying guides, and editorial articles from Star Store — for people who care about what they buy.',
      canonical: `${SITE_URL}/blog`,
      body: `<h1>The Journal</h1><p>In-depth reviews, buying guides, and tech stories from Star Store.</p><ul>${listItems}</ul>`,
    }),
  );
  urls.unshift({ loc: `${SITE_URL}/blog`, priority: '0.8' });

  // Homepage static snapshot
  const featured = published.slice(0, 6);
  const homeBody = `
    <h1>Star Store — Premium Tech, Curated for You</h1>
    <p>Star Store is an editorial affiliate commerce site featuring hand-picked gadgets, honest buying guides, and in-depth tech journalism. We connect discerning shoppers with verified deals from official stores worldwide.</p>
    <h2>Latest from The Journal</h2>
    <ul>${featured.map((p) => `<li><a href="${SITE_URL}/blog/${p.id}">${p.title}</a> — ${p.excerpt || ''}</li>`).join('')}</ul>
    <h2>Shop by Category</h2>
    <p>Browse our <a href="${SITE_URL}/catalog">full catalog</a> for smartphones, laptops, audio, wearables, cameras, and accessories.</p>
    <h2>About Star Store</h2>
    <p>We publish expert buying guides and product reviews to help you make informed decisions. Read our <a href="${SITE_URL}/about">About page</a>, <a href="${SITE_URL}/legal/privacy">Privacy Policy</a>, and <a href="${SITE_URL}/contact">Contact</a> information.</p>`;

  writeFileSync(
    resolve(OUT, 'index.html'),
    pageShell({
      title: 'Star Store — Premium Tech, Curated for You',
      description:
        'Hand-picked gadgets, honest buying guides, and tech journalism. Verified affiliate deals from official stores.',
      canonical: SITE_URL,
      body: homeBody,
    }),
  );

  // Dynamic sitemap
  const staticPages = [
    { loc: SITE_URL, priority: '1.0' },
    { loc: `${SITE_URL}/catalog`, priority: '0.9' },
    { loc: `${SITE_URL}/about`, priority: '0.5' },
    { loc: `${SITE_URL}/contact`, priority: '0.5' },
    { loc: `${SITE_URL}/legal/privacy`, priority: '0.3' },
    { loc: `${SITE_URL}/legal/terms`, priority: '0.3' },
    { loc: `${SITE_URL}/legal/disclaimer`, priority: '0.3' },
  ];

  const allUrls = [...staticPages, ...urls];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((u) => `  <url><loc>${u.loc}</loc><changefreq>weekly</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`;

  writeFileSync(resolve(__dirname, '../public/sitemap.xml'), sitemap);

  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /adminpanel

Sitemap: ${SITE_URL}/sitemap.xml
`;
  writeFileSync(resolve(__dirname, '../public/robots.txt'), robots);

  console.log(`\nDone — ${published.length} articles prerendered, sitemap updated (${allUrls.length} URLs).`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
