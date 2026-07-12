import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { getSeedArticle } from '../content/seedArticles';

const BLOGS_COLLECTION = 'blogs';

/**
 * Normalises raw form values into the exact shape we persist in Firestore.
 * `content` is stored as an HTML string produced by the Tiptap editor.
 * We keep both `coverImage` (new) and `image` (read by the hero/cards) in
 * sync so existing render code keeps working.
 */
function toBlogDocument(form) {
  const cover = (form.coverImage || form.image || '').trim();
  const doc = {
    title: (form.title || '').trim(),
    excerpt: (form.excerpt || '').trim(),
    content: form.content || '',
    coverImage: cover,
    image: cover,
    category: form.category || 'Uncategorized',
    author: (form.author || '').trim() || 'Star Store Editorial',
    authorRole: (form.authorRole || '').trim(),
    authorBio: (form.authorBio || '').trim(),
    authorCredentials: (form.authorCredentials || '').trim(),
    authorAvatar: (form.authorAvatar || '').trim(),
    tags: Array.isArray(form.tags) ? form.tags.map((t) => t.trim()).filter(Boolean) : [],
    status: form.status === 'published' ? 'published' : 'draft',
  };
  if (form.seedKey) doc.seedKey = form.seedKey;
  return doc;
}

/**
 * Create a new blog post. Returns the new document id.
 */
export async function createBlogPost(form) {
  const now = new Date();
  const payload = {
    ...toBlogDocument(form),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    // Human-readable date kept for backward compatibility with existing UI.
    date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    publishedAt: form.status === 'published' ? now.toISOString() : null,
  };

  const ref = await addDoc(collection(db, BLOGS_COLLECTION), payload);
  return ref.id;
}

/**
 * Update an existing blog post in place. Returns the document id.
 */
export async function updateBlogPost(id, form) {
  const now = new Date();
  const payload = {
    ...toBlogDocument(form),
    updatedAt: now.toISOString(),
  };
  if (form.status === 'published') {
    payload.publishedAt = form.publishedAt || now.toISOString();
  }

  await updateDoc(doc(db, BLOGS_COLLECTION, id), payload);
  return id;
}

/**
 * Permanently delete a blog post.
 */
export async function deleteBlogPost(id) {
  await deleteDoc(doc(db, BLOGS_COLLECTION, id));
  return id;
}

/** Find an existing post created from a seed key (idempotent publishing). */
export async function findPostBySeedKey(seedKey) {
  const q = query(collection(db, BLOGS_COLLECTION), where('seedKey', '==', seedKey));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

/**
 * Publish a curated seed article once. Re-publishing updates the existing doc.
 * Returns `{ id, created: boolean }`.
 */
export async function publishSeedArticle(seedKey) {
  const seed = getSeedArticle(seedKey);
  if (!seed) throw new Error(`Unknown seed article: ${seedKey}`);

  const existing = await findPostBySeedKey(seedKey);
  if (existing) {
    await updateBlogPost(existing.id, { ...seed, publishedAt: existing.publishedAt });
    return { id: existing.id, created: false };
  }

  const id = await createBlogPost(seed);
  return { id, created: true };
}
