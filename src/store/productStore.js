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
