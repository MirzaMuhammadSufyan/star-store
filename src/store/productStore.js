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

export const useProductStore = create((set) => ({
  products: [],
  loading: true,
  error: null,

  syncFromAliExpress: async (keywords = 'tech') => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/products/sync?keywords=${encodeURIComponent(keywords)}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AliExpress Sync Error Response:', errorText);
        set({ error: `Sync failed: ${response.status} ${response.statusText}`, loading: false });
        return [];
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError, 'Raw response:', text);
        set({ error: 'Invalid response from server', loading: false });
        return [];
      }

      if (data.success) {
        set({ products: data.products, loading: false });
        return data.products;
      } else {
        set({ error: data.error || 'Failed to sync products', loading: false });
        return [];
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      return [];
    }
  },

  fetchProducts: () => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      set({ products, loading: false });
    });
    return unsubscribe;
  },

  addProduct: async (product) => {
    try {
      const slug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await addDoc(collection(db, 'products'), {
        ...product,
        slug,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  },

  updateProduct: async (id, updatedProduct) => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  },

  deleteProduct: async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
}));

// Initialize the listener
useProductStore.getState().fetchProducts();
