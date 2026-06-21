import { create } from 'zustand';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

export const useBlogStore = create((set) => ({
  posts: [],
  loading: true,
  categories: ['All', 'Reviews', 'Technology', 'Lifestyle', 'Guides'],

  fetchPosts: () => {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      set({ posts, loading: false });
    });
    return unsubscribe;
  },

  addPost: async (post) => {
    try {
      await addDoc(collection(db, 'blogs'), {
        ...post,
        createdAt: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
    } catch (error) {
      console.error("Error adding blog post:", error);
    }
  },

  updatePost: async (id, updatedPost) => {
    try {
      const postRef = doc(db, 'blogs', id);
      await updateDoc(postRef, updatedPost);
    } catch (error) {
      console.error("Error updating blog post:", error);
    }
  },

  deletePost: async (id) => {
    try {
      await deleteDoc(doc(db, 'blogs', id));
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  }
}));

// Initialize the listener
useBlogStore.getState().fetchPosts();
