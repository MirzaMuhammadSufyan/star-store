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

export const useProductStore = create((set, get) => ({
  products: [],
  dbProducts: [],
  apiProducts: [],
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
        const apiProducts = data.products || [];
        set({
          apiProducts,
          products: [...get().dbProducts, ...apiProducts],
          loading: false
        });
        return apiProducts;
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
      const dbProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      set({
        dbProducts,
        products: [...dbProducts, ...get().apiProducts],
        loading: false
      });
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
      await deleteDoc(doc(db, 'products', String(id)));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  },

  // Fetch a single product by ID — checks Firestore first, then AliExpress API.
  // Used by ProductDetailPage so shared links always resolve.
  fetchProductById: async (id) => {
    // 1. Already in memory?
    const existing = get().products.find(
      p => p.id === id || String(p.product_id) === id
    );
    if (existing) return existing;

    // 2. Try Firestore (manually-added products have a Firestore doc ID)
    try {
      const { getDoc } = await import('firebase/firestore');
      const snap = await getDoc(doc(db, 'products', String(id)));
      if (snap.exists()) {
        const product = { id: snap.id, ...snap.data() };
        // Merge into store so it's available for related products etc.
        set(s => ({ products: [...s.products.filter(p => p.id !== product.id), product] }));
        return product;
      }
    } catch (_) {}

    // 3. Try AliExpress detail API (numeric product_id)
    try {
      const res  = await fetch(`/api/products/detail?product_ids=${encodeURIComponent(id)}`);
      const data = await res.json();
      const list =
        data?.aliexpress_affiliate_product_detail_get_response?.resp_result?.result?.products?.product || [];
      if (list.length > 0) {
        const product = list[0];
        set(s => ({ products: [...s.products, product] }));
        return product;
      }
    } catch (_) {}

    return null;
  }
}));

// Initialize the listener
useProductStore.getState().fetchProducts();
