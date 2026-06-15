import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProductStore = create(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]
      })),
      updateProduct: (id, updatedProduct) => set((state) => ({
        products: state.products.map((p) => p.id === id ? { ...p, ...updatedProduct } : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id)
      })),
    }),
    {
      name: 'star-store-products',
    }
  )
);
