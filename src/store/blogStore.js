import { create } from 'zustand';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { JOURNAL_FILTERS, categoriesFromPosts } from '../utils/blogCategories';

export const useBlogStore = create((set) => ({
  posts: [],
  loading: true,
  /** Filter chips — starts as canonical list, then aligns to published volume. */
  categories: JOURNAL_FILTERS,

  fetchPosts: () => {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({
        posts,
        loading: false,
        categories: categoriesFromPosts(posts),
      });
    });
    return unsubscribe;
  },
}));

useBlogStore.getState().fetchPosts();
