import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_PRODUCTS = [
  {
    id: '1',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'The Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening. 2 processors control 8 microphones for unprecedented noise cancellation and exceptional call quality.',
    price: '398.00',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    category: 'Audio',
    affiliateLink: 'https://www.amazon.com/Sony-WH-1000XM5-Canceling-Headphones-Hands-Free/dp/B09XS7JWHH',
    rating: '4.9'
  },
  {
    id: '2',
    title: 'MacBook Pro 14-inch (M3 Pro)',
    description: 'The 14-inch MacBook Pro blasts forward with M3 Pro and M3 Max, incredibly sophisticated chips that bring phenomenal performance and specialized capabilities for the most demanding workflows.',
    price: '1999.00',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    category: 'Laptops',
    affiliateLink: 'https://www.apple.com/macbook-pro/',
    rating: '4.8'
  },
  {
    id: '3',
    title: 'Apple Watch Ultra 2',
    description: 'The most rugged and capable Apple Watch. Designed for outdoor adventures and supercharged workouts with a lightweight titanium case, extra-long battery life, and the brightest-ever display.',
    price: '799.00',
    image: 'https://images.unsplash.com/photo-1434493907317-a46b53b81882?auto=format&fit=crop&q=80&w=800',
    category: 'Wearables',
    affiliateLink: 'https://www.apple.com/apple-watch-ultra-2/',
    rating: '4.9'
  },
  {
    id: '4',
    title: 'Logitech MX Master 3S',
    description: 'An icon remastered. Feel every moment of your workflow with even more precision, tactility, and performance, thanks to Quiet Clicks and an 8,000 DPI track-on-glass sensor.',
    price: '99.00',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800',
    category: 'Accessories',
    affiliateLink: 'https://www.logitech.com/en-us/products/mice/mx-master-3s.910-006557.html',
    rating: '4.7'
  },
  {
    id: '5',
    title: 'DJI Mini 4 Pro',
    description: 'The ultimate mini camera drone for high-quality content creation. Featuring 4K/60fps HDR, 20km video transmission, and omnidirectional obstacle sensing.',
    price: '759.00',
    image: 'https://images.unsplash.com/photo-1473963342623-0c36087f92e8?auto=format&fit=crop&q=80&w=800',
    category: 'Electronics',
    affiliateLink: 'https://www.dji.com/mini-4-pro',
    rating: '4.9'
  },
  {
    id: '6',
    title: 'Keychron Q6 Max QMK/VIA',
    description: 'A full-size wireless custom mechanical keyboard with double-gasket design, full aluminum body, and premium switches for an unparalleled typing experience.',
    price: '219.00',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800',
    category: 'Accessories',
    affiliateLink: 'https://www.keychron.com/',
    rating: '4.8'
  }
];

export const useProductStore = create(
  persist(
    (set) => ({
      products: DEFAULT_PRODUCTS,
      addProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]
      })),
      updateProduct: (id, updatedProduct) => set((state) => ({
        products: state.products.map((p) => p.id === id ? { ...p, ...updatedProduct } : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id)
      })),
      setProducts: (products) => set({ products })
    }),
    {
      name: 'star-store-products-v2',
    }
  )
);
