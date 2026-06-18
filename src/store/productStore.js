import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MERCHANTS = ['Amazon', 'Walmart', 'Apple', 'Best Buy', 'B&H Photo'];

const generateProducts = () => {
  const categories = ['Audio', 'Laptops', 'Wearables', 'Accessories', 'Photography', 'Gaming'];
  const items = [];
  
  const baseItems = [
    { title: 'Sony WH-1000XM5', merchant: 'Amazon', price: '398.00', category: 'Audio', img: 'https://images.unsplash.com/photo-1618366712277-70f398a58221?auto=format&fit=crop&q=80&w=800' },
    { title: 'MacBook Pro 14"', merchant: 'Apple', price: '1999.00', category: 'Laptops', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800' },
    { title: 'Apple Watch Ultra 2', merchant: 'Apple', price: '799.00', category: 'Wearables', img: 'https://images.unsplash.com/photo-1434493907317-a46b53b81846?auto=format&fit=crop&q=80&w=800' },
    { title: 'Logitech MX Master 3S', merchant: 'Best Buy', price: '99.00', category: 'Accessories', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800' },
    { title: 'DJI Mini 4 Pro', merchant: 'Amazon', price: '759.00', category: 'Photography', img: 'https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?auto=format&fit=crop&q=80&w=800' },
    { title: 'Keychron Q6 Max', merchant: 'Amazon', price: '219.00', category: 'Accessories', img: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800' },
    { title: 'PS5 Slim Console', merchant: 'Walmart', price: '449.00', category: 'Gaming', img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=800' },
    { title: 'Nintendo Switch OLED', merchant: 'Best Buy', price: '349.00', category: 'Gaming', img: 'https://images.unsplash.com/photo-1578303528022-9965d0426745?auto=format&fit=crop&q=80&w=800' },
    { title: 'Canon EOS R5', merchant: 'B&H Photo', price: '2999.00', category: 'Photography', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800' },
    { title: 'iPad Pro M4', merchant: 'Apple', price: '999.00', category: 'Laptops', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800' },
  ];

  for (let i = 0; i < 40; i++) {
    const base = baseItems[i % baseItems.length];
    const id = (i + 1).toString();
    const discount = i % 3 === 0 ? Math.floor(Math.random() * 20 + 10) : 0;
    
    items.push({
      id,
      slug: `${base.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id}`,
      title: `${base.title} ${i > 9 ? `(Gen ${Math.floor(i/10) + 1})` : ''}`,
      description: `Premium ${base.category} equipment designed for high performance and reliability. Featuring the latest technology and sleek design, the ${base.title} is a top choice for professionals and enthusiasts alike. Includes full warranty and verified merchant support.`,
      price: base.price,
      image: base.img,
      category: base.category,
      merchant: base.merchant,
      affiliateLink: `https://www.${base.merchant.toLowerCase().replace(' ', '')}.com/ref-id-${id}`,
      rating: (Math.random() * (5 - 4) + 4).toFixed(1),
      discount,
      isNew: i < 5,
      tags: [base.category, 'Tech', 'Premium']
    });
  }
  return items;
};

export const useProductStore = create(
  persist(
    (set) => ({
      products: generateProducts(),
      addProduct: (product) => set((state) => ({ 
        products: [...state.products, { 
          ...product, 
          id: crypto.randomUUID(), 
          slug: product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          createdAt: new Date().toISOString() 
        }] 
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
      name: 'star-store-products-v3',
    }
  )
);
