import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, ChevronRight, Grid, List } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import ProductCard from '../components/ProductCard';
import { Input } from '../components/ui/Input';

const CatalogPage = () => {
  const { products } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(1000);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesPrice = parseFloat(p.price) <= priceRange;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold dark:text-white mb-2">Product Catalog</h1>
          <p className="text-gray-500 dark:text-gray-400">Explore our curated selection of premium gadgets</p>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          <span>{filteredProducts.length} Products Found</span>
          <div className="h-4 w-[1px] bg-gray-200 dark:bg-white/10" />
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded bg-orange-500 text-white"><Grid size={16} /></button>
            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5"><List size={16} /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-6 space-y-8 dark:bg-white/5 bg-white border-gray-100 dark:border-white/10">
            <div className="space-y-4">
              <h3 className="font-bold dark:text-white flex items-center gap-2 uppercase text-xs tracking-widest text-gray-400">
                <Search size={14} className="text-orange-500" /> Search
              </h3>
              <Input
                placeholder="Find a product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 dark:bg-black/20"
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-bold dark:text-white flex items-center gap-2 uppercase text-xs tracking-widest text-gray-400">
                <Filter size={14} className="text-orange-500" /> Categories
              </h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onPointerUp={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-sm transition-all flex items-center justify-between group ${
                      selectedCategory === cat
                        ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 font-black'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
                  >
                    {cat}
                    <ChevronRight size={14} className={`transition-transform ${selectedCategory === cat ? 'rotate-0' : '-rotate-90 opacity-0 group-hover:opacity-100'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold dark:text-white flex items-center gap-2 uppercase text-xs tracking-widest text-gray-400">
                <SlidersHorizontal size={14} className="text-orange-500" /> Price Range
              </h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>$0</span>
                  <span className="text-orange-600 dark:text-orange-400 px-2 py-1 bg-orange-500/10 rounded-lg">Up to ${priceRange}</span>
                  <span>$1000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 bg-orange-500 text-white overflow-hidden relative group border-none">
            <div className="relative z-10 space-y-4">
              <h4 className="font-black text-2xl leading-tight">Need expert help?</h4>
              <p className="text-white/80 text-sm">Chat with our product specialists for personalized recommendations.</p>
              <button className="px-6 py-3 bg-white text-orange-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">Contact Support</button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
          </div>
        </div>

        {/* Main Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 glass-card bg-gray-50 dark:bg-white/5 border-dashed border-gray-200 dark:border-white/10">
              <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold dark:text-white">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms</p>
              <button
                onPointerUp={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setPriceRange(1000);
                }}
                className="mt-6 text-orange-500 font-bold hover:underline uppercase text-xs tracking-widest"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
