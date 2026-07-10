/**
 * Fix broken banner images in Firestore:
 * - Re-sync image/coverImage from seed articles (by seedKey)
 * - Convert stale /images/blog/*.png paths to .webp
 * - Patch legacy docs missing seedKey
 *
 * Usage: node scripts/sync-blog-images.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

const { getSeedArticle } = await import('../src/content/seedArticles.js');
const { LEGACY_BLOG_IMAGE_FIXES } = await import('../src/utils/articleProductMap.js');

function normalizeLocalImage(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('/images/blog/') && trimmed.endsWith('.png')) {
    return trimmed.replace(/\.png$/, '.webp');
  }
  return trimmed;
}

function resolveImageForPost(id, data) {
  const legacy = LEGACY_BLOG_IMAGE_FIXES[id];
  if (legacy?.image) {
    return { image: legacy.image, seedKey: legacy.seedKey || data.seedKey };
  }

  const seedKey = data.seedKey;
  if (seedKey) {
    const seed = getSeedArticle(seedKey);
    if (seed?.image) return { image: seed.image, seedKey };
  }

  const fromDoc = normalizeLocalImage(data.image || data.coverImage || '');
  return { image: fromDoc, seedKey: data.seedKey };
}

async function main() {
  const { initializeApp } = await import('firebase/app');
  const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
  const { getFirestore, collection, getDocs, doc, updateDoc } = await import('firebase/firestore');

  const email = process.env.FIREBASE_EMAIL;
  const password = process.env.FIREBASE_PASSWORD;
  if (!email || !password) {
    throw new Error('Set FIREBASE_EMAIL and FIREBASE_PASSWORD in .env');
  }

  const app = initializeApp(firebaseConfig);
  await signInWithEmailAndPassword(getAuth(app), email, password);
  const db = getFirestore(app);

  const snap = await getDocs(collection(db, 'blogs'));
  let updated = 0;

  for (const blogDoc of snap.docs) {
    const data = blogDoc.data();
    const { image, seedKey } = resolveImageForPost(blogDoc.id, data);
    const current = (data.image || data.coverImage || '').trim();
    const needsSeedKey = seedKey && data.seedKey !== seedKey;
    const needsImage = image && current !== image;

    if (!needsImage && !needsSeedKey) continue;

    const patch = {
      updatedAt: new Date().toISOString(),
    };
    if (image) {
      patch.image = image;
      patch.coverImage = image;
    }
    if (needsSeedKey && seedKey) patch.seedKey = seedKey;

    await updateDoc(doc(db, 'blogs', blogDoc.id), patch);
    console.log('Fixed', blogDoc.id, '→', image || current, needsSeedKey ? `(seedKey: ${seedKey})` : '');
    updated += 1;
  }

  console.log(`\nDone — ${updated} of ${snap.size} posts updated.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
