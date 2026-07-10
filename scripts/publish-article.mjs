/**
 * Publish a curated seed article to Firestore from the CLI.
 *
 * Usage:
 *   FIREBASE_EMAIL=you@example.com FIREBASE_PASSWORD=secret npm run publish:article -- the-reality-of-war
 *
 * Or with a service account (bypasses client auth):
 *   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npm run publish:article -- the-reality-of-war
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedKey = process.argv[2] || 'the-reality-of-war';

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
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'star-store-77521.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '60182804335',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:60182804335:web:0a112df3586df907e81a9a',
};

async function publishWithAdminSdk(seed) {
  const { initializeApp, applicationDefault, cert } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const credential = credPath
    ? cert(JSON.parse(readFileSync(resolve(credPath), 'utf8')))
    : applicationDefault();

  initializeApp({ credential, projectId: firebaseConfig.projectId });
  const db = getFirestore();
  const now = new Date();
  const payload = {
    title: seed.title,
    excerpt: seed.excerpt,
    content: seed.content,
    image: seed.image,
    coverImage: seed.image,
    category: seed.category,
    author: seed.author,
    tags: seed.tags,
    status: 'published',
    seedKey: seed.seedKey,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    publishedAt: now.toISOString(),
    date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };

  const existing = await db.collection('blogs').where('seedKey', '==', seed.seedKey).limit(1).get();
  if (!existing.empty) {
    const ref = existing.docs[0].ref;
    await ref.update({ ...payload, createdAt: existing.docs[0].data().createdAt, publishedAt: existing.docs[0].data().publishedAt || payload.publishedAt });
    return { id: ref.id, created: false };
  }

  const ref = await db.collection('blogs').add(payload);
  return { id: ref.id, created: true };
}

async function publishWithClientSdk(seed) {
  const { initializeApp } = await import('firebase/app');
  const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
  const { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc } = await import('firebase/firestore');

  const email = process.env.FIREBASE_EMAIL;
  const password = process.env.FIREBASE_PASSWORD;
  if (!email || !password) {
    throw new Error('Set FIREBASE_EMAIL and FIREBASE_PASSWORD, or GOOGLE_APPLICATION_CREDENTIALS for admin SDK.');
  }

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  await signInWithEmailAndPassword(auth, email, password);

  const db = getFirestore(app);
  const existingSnap = await getDocs(query(collection(db, 'blogs'), where('seedKey', '==', seed.seedKey)));
  const now = new Date();
  const payload = {
    title: seed.title,
    excerpt: seed.excerpt,
    content: seed.content,
    image: seed.image,
    coverImage: seed.image,
    category: seed.category,
    author: seed.author,
    tags: seed.tags,
    status: 'published',
    seedKey: seed.seedKey,
    updatedAt: now.toISOString(),
    date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };

  if (!existingSnap.empty) {
    const existing = existingSnap.docs[0];
    await updateDoc(doc(db, 'blogs', existing.id), {
      ...payload,
      publishedAt: existing.data().publishedAt || now.toISOString(),
    });
    return { id: existing.id, created: false };
  }

  const ref = await addDoc(collection(db, 'blogs'), {
    ...payload,
    createdAt: now.toISOString(),
    publishedAt: now.toISOString(),
  });
  return { id: ref.id, created: true };
}

async function main() {
  const { getSeedArticle } = await import('../src/content/seedArticles.js');
  const seed = getSeedArticle(seedKey);
  if (!seed) {
    console.error(`Unknown seed key: ${seedKey}`);
    process.exit(1);
  }

  let result;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    result = await publishWithAdminSdk(seed);
  } else {
    result = await publishWithClientSdk(seed);
  }

  console.log(result.created ? `Published: /blog/${result.id}` : `Updated: /blog/${result.id}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
