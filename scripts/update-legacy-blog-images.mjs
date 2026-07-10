/**
 * Update cover images on legacy blog posts (no seedKey) to owned local assets.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

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

const LEGACY_IMAGES = {
  NiGcSKKYf30ahRo8mpN0: '/images/blog/guide-ai-2026.webp',
  RnThPVJ3d2dEEDKZVFBw: '/images/blog/smart-home-setup-2026.webp',
  et6oKdCR5x6jSMfEqHbO: '/images/blog/guide-css-2026.webp',
};

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyDeYpQDX8a7Rt-j_5t8BdWX4jC3eRNJh9g',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'star-store-77521.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'star-store-77521',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
await signInWithEmailAndPassword(auth, process.env.FIREBASE_EMAIL, process.env.FIREBASE_PASSWORD);
const db = getFirestore(app);

for (const [id, image] of Object.entries(LEGACY_IMAGES)) {
  await updateDoc(doc(db, 'blogs', id), {
    image,
    coverImage: image,
    updatedAt: new Date().toISOString(),
  });
  console.log('Updated', id, '→', image);
}

process.exit(0);
