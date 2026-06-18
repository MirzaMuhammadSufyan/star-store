import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAnalyticsStore = create(
  persist(
    (set, get) => ({
      clicks: [],
      logClick: (productId, merchant) => set((state) => ({
        clicks: [...state.clicks, {
          productId,
          merchant,
          timestamp: new Date().toISOString()
        }]
      })),
      getStats: () => {
        const stats = {};
        get().clicks.forEach(click => {
          stats[click.productId] = (stats[click.productId] || 0) + 1;
        });
        return stats;
      }
    }),
    {
      name: 'star-store-analytics',
    }
  )
);
