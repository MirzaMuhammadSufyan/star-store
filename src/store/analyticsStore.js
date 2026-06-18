import { create } from 'zustand';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  serverTimestamp
} from 'firebase/firestore';

export const useAnalyticsStore = create((set, get) => ({
  clicks: [],

  fetchClicks: () => {
    const q = query(collection(db, 'analytics'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clicks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      set({ clicks });
    });
    return unsubscribe;
  },

  logClick: async (productId, merchant) => {
    try {
      await addDoc(collection(db, 'analytics'), {
        productId,
        merchant,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error logging click:", error);
    }
  },

  getStats: () => {
    const stats = {};
    get().clicks.forEach(click => {
      if (click.productId) {
        stats[click.productId] = (stats[click.productId] || 0) + 1;
      }
    });
    return stats;
  }
}));

// Initialize the listener
useAnalyticsStore.getState().fetchClicks();
