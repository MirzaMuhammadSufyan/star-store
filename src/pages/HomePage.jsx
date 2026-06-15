import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useProductStore } from '../store/productStore';

const HomePage = () => {
  const products = useProductStore((state) => state.products);

  return (
    <div className="space-y-12">
      <Hero />

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Latest Arrivals</h2>
          <div className="h-px flex-grow mx-8 bg-white/10 hidden md:block" />
          <span className="text-white/40 text-sm font-medium">{products.length} Products</span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-20 text-center flex flex-col items-center justify-center border-dashed border-white/20">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <span className="text-white/20 text-2xl">📦</span>
            </div>
            <h3 className="text-xl font-medium text-white/80 mb-2">No products yet</h3>
            <p className="text-white/40 max-w-sm">
              Our curators are currently selecting the finest items for you.
              Check back soon or visit the admin panel to add products.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
