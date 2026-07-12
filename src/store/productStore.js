import { create } from 'zustand';
import { db } from '../firebase';
import { slugifyTitle, withNormalizedLinks } from '../utils/productLinks';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

/** Shared in-flight promise so article/home/catalog don't stampede the sync API. */
let ensureCatalogPromise = null;

export const useProductStore = create((set, get) => ({
  products:   [],
  dbProducts: [],
  apiProducts: [],
  dbLoading:  true,   // true until Firestore first snapshot arrives
  syncLoading: false, // true only during AliExpress sync
  loading:    true,   // legacy alias — kept so existing components don't break
  error: null,

  syncFromAliExpress: async (keywords = 'tech', pageNo = 1, pageSize = 50) => {
    set({ syncLoading: true, error: null });
    try {
      const url = `/api/products/sync?keywords=${encodeURIComponent(keywords)}&page_no=${pageNo}&page_size=${pageSize}`;
      const response = await fetch(url);

      if (!response.ok) {
        set({ error: `Sync failed: ${response.status} ${response.statusText}`, syncLoading: false });
        return [];
      }

      let data;
      try { data = JSON.parse(await response.text()); }
      catch { set({ error: 'Invalid response from server', syncLoading: false }); return []; }

      if (data.success) {
        const newProducts = data.products || [];
        // Never let an empty page-1 response wipe products already in memory
        // (React Strict Mode / overlapping article+home syncs caused this).
        if (pageNo === 1 && newProducts.length === 0 && get().apiProducts.length > 0) {
          set({ syncLoading: false });
          return [];
        }
        // Page 1 (or new keyword search) replaces; subsequent pages append
        const existing = pageNo === 1 ? [] : get().apiProducts;
        // Deduplicate by product_id
        const merged = [...existing];
        for (const p of newProducts) {
          if (!merged.some(e => String(e.product_id) === String(p.product_id))) merged.push(p);
        }
        set({
          apiProducts: merged,
          products: [...get().dbProducts, ...merged],
          syncLoading: false,
        });
        return newProducts;
      } else {
        set({ error: data.error || 'Failed to sync products', syncLoading: false });
        return [];
      }
    } catch (error) {
      set({ error: error.message, syncLoading: false });
      return [];
    }
  },

  /**
   * Guarantee live AliExpress products are in memory (for article sidebars,
   * home, etc.). Shares one in-flight request and falls back to broad
   * keywords when the article-specific query returns nothing.
   */
  ensureCatalogProducts: async (preferredKeywords = 'tech gadgets') => {
    if (get().apiProducts.length > 0) return get().apiProducts;
    if (ensureCatalogPromise) return ensureCatalogPromise;

    ensureCatalogPromise = (async () => {
      try {
        const attempts = [
          preferredKeywords,
          'tech gadgets',
          'electronics',
          'laptop',
        ].filter((kw, i, arr) => kw && arr.indexOf(kw) === i);

        for (const kw of attempts) {
          if (get().apiProducts.length > 0) break;
          await get().syncFromAliExpress(kw, 1, 24);
        }
        return get().apiProducts;
      } finally {
        ensureCatalogPromise = null;
      }
    })();

    return ensureCatalogPromise;
  },

  fetchProducts: () => {
    set({ dbLoading: true, loading: true });
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      set({
        dbProducts,
        products: [...dbProducts, ...get().apiProducts],
        dbLoading: false,
        loading: false,
      });
    }, (err) => {
      console.error('Firestore snapshot error:', err);
      set({ dbLoading: false, loading: false });
    });
    return unsubscribe;
  },

  addProduct: async (product) => {
    try {
      const normalized = withNormalizedLinks(product);
      const baseSlug = slugifyTitle(normalized.title || normalized.product_title || 'product');
      const pid = normalized.product_id || '';
      const slug = normalized.slug || (pid ? `${baseSlug}-${pid}` : baseSlug) || `product-${Date.now()}`;
      await addDoc(collection(db, 'products'), {
        ...normalized,
        slug,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  },

  updateProduct: async (id, updatedProduct) => {
    try {
      await updateDoc(doc(db, 'products', String(id)), withNormalizedLinks(updatedProduct));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  },

  deleteProduct: async (id) => {
    try {
      await deleteDoc(doc(db, 'products', String(id)));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  },

  // Fetch a single product by Firestore doc ID or AliExpress product_id.
  // Used by ProductDetailPage so shared links always resolve.
  fetchProductById: async (id) => {
    // 1. Already in memory?
    const existing = get().products.find(
      p => p.id === id || String(p.product_id) === String(id)
    );
    if (existing) return existing;

    const isNumericId = /^\d+$/.test(String(id));

    // 2. Try Firestore only for non-numeric IDs (Firestore auto-IDs are alphanumeric)
    if (!isNumericId) {
      try {
        const snap = await getDoc(doc(db, 'products', String(id)));
        if (snap.exists()) {
          const product = { id: snap.id, ...snap.data() };
          set(s => ({
            dbProducts: [...s.dbProducts.filter(p => p.id !== product.id), product],
            products:   [...s.products.filter(p => p.id !== product.id), product],
          }));
          return product;
        }
      } catch (_) {}

      // 2b. Also check dbProducts for matching product_id
      const byProductId = get().dbProducts.find(p => String(p.product_id) === String(id));
      if (byProductId) return byProductId;
    }

    // 3. Fetch from AliExpress detail API using product_id
    try {
      const res  = await fetch(`/api/products/detail?product_ids=${encodeURIComponent(id)}`);
      const data = await res.json();
      const list =
        data?.aliexpress_affiliate_product_detail_get_response
            ?.resp_result?.result?.products?.product || [];
      if (list.length > 0) {
        const product = list[0];
        set(s => ({ products: [...s.products, product] }));
        return product;
      }
    } catch (_) {}

    return null;
  },
}));

// Start Firestore real-time listener immediately
useProductStore.getState().fetchProducts();
