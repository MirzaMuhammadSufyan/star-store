import { create } from 'zustand';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export const useBlogStore = create((set) => ({
  posts: [],
  loading: true,
  categories: ['All', 'Editorial', 'Reviews', 'Technology', 'Lifestyle', 'Guides'],

  fetchPosts: () => {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ posts, loading: false });
    });
    return unsubscribe;
  },
}));

useBlogStore.getState().fetchPosts();
