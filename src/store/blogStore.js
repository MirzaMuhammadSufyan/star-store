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
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
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
      await addDoc(collection(db, 'posts'), {
        ...post,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error adding post:", error);
    }
  },

  updatePost: async (id, updatedPost) => {
    try {
      const postRef = doc(db, 'posts', id);
      await updateDoc(postRef, updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  },

  deletePost: async (id) => {
    try {
      await deleteDoc(doc(db, 'posts', id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }
}));

// Initialize the listener
useBlogStore.getState().fetchPosts();
