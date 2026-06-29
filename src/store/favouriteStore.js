import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavouriteStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggle: (product) => {
        const id = product.product_id || product.id;
        const exists = get().items.some(p => (p.product_id || p.id) === id);
        set({
          items: exists
            ? get().items.filter(p => (p.product_id || p.id) !== id)
            : [...get().items, product],
        });
      },

      isFavourite: (product) => {
        const id = product?.product_id || product?.id;
        return get().items.some(p => (p.product_id || p.id) === id);
      },

      remove: (id) => set({ items: get().items.filter(p => (p.product_id || p.id) !== id) }),

      clear: () => set({ items: [] }),

      count: () => get().items.length,
    }),
    { name: 'star-store-favourites' }
  )
);
