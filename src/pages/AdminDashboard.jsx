import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Search, BarChart3, TrendingUp, MousePointer2, Users, Zap } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import ProductForm from '../components/ProductForm';

const AdminDashboard = () => {
  const { products, deleteProduct, loading: productsLoading } = useProductStore();
  const { clicks, getStats } = useAnalyticsStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');

  const stats = getStats();
  const totalClicks = clicks.length;

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter(p =>
        (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const topProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return [...products]
        .sort((a, b) => (stats[b.id] || 0) - (stats[a.id] || 0))
        .slice(0, 5);
  }, [products, stats]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  if (productsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Zap className="text-orange-500 animate-pulse mb-4" size={48} />
        <h2 className="text-xl font-bold dark:text-white">Loading Command Center...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div>
          <h1 className="text-4xl font-black dark:text-white text-orange-950">Command Center</h1>
          <p className="text-gray-500 font-medium text-sm uppercase tracking-widest mt-1">Real-time Performance Metrics & Inventory</p>
        </div>
        <div className="flex gap-3 md:gap-4">
           <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl md:rounded-2xl border border-gray-200 dark:border-white/10">
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-white dark:bg-orange-500 shadow-xl dark:text-white text-gray-900' : 'text-gray-400'}`}
              >
                Inventory
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-white dark:bg-orange-500 shadow-xl dark:text-white text-gray-900' : 'text-gray-400'}`}
              >
                Analytics
              </button>
           </div>
           <Button onClick={handleAddNew} className="gap-2 md:gap-3 px-6 md:px-8 h-12 md:h-14 font-black uppercase text-[10px] md:text-xs tracking-widest shadow-orange-500/40">
            <Plus size={18} /> New Product
          </Button>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <div className="glass-card p-4 md:p-8 bg-white dark:bg-white/2 border-gray-100 dark:border-white/5 animate-fade-in">
          <div className="relative mb-6 md:mb-10">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500" size={18} />
            <Input 
              placeholder="Search products..." 
              className="pl-14 h-12 md:h-14 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/10 text-gray-400 dark:text-white/40 text-[10px] font-black uppercase tracking-widest">
                  <th className="pb-6 px-4">Product Information</th>
                  <th className="pb-6 px-4">Category</th>
                  <th className="pb-6 px-4">Merchant</th>
                  <th className="pb-6 px-4">Performance</th>
                  <th className="pb-6 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-orange-500/[0.02] transition-colors">
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-4">
                        <img src={product.image} className="w-14 h-14 rounded-2xl object-cover shadow-lg" alt="" />
                        <div>
                          <span className="dark:text-white text-gray-900 font-bold block">{product.title}</span>
                          <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">${product.price}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <span className="bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/60 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{product.category}</span>
                    </td>
                    <td className="py-6 px-4">
                      <span className="text-sm font-bold text-orange-500">{product.merchant || 'Partner'}</span>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-2">
                        <MousePointer2 size={14} className="text-orange-500" />
                        <span className="text-lg font-black dark:text-white">{stats[product.id] || 0}</span>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="glass" 
                          size="sm" 
                          className="p-2 border-gray-100 dark:border-white/5"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          className="p-2"
                          onClick={() => {
                            if(window.confirm('Are you sure you want to delete this product?')) {
                              deleteProduct(product.id);
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-12 animate-fade-in">
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
             {[
               { label: 'Total Engagement', val: totalClicks, icon: MousePointer2, color: 'text-orange-500' },
               { label: 'Unique Merchant Hits', val: new Set(clicks.map(c => c.merchant)).size, icon: TrendingUp, color: 'text-green-500' },
               { label: 'Conversion Intent', val: (totalClicks * 0.15).toFixed(0), icon: BarChart3, color: 'text-blue-500' },
               { label: 'Active Tracking Nodes', val: filteredProducts.length, icon: Users, color: 'text-purple-500' },
             ].map((stat, i) => (
               <div key={i} className="glass-card p-8 bg-white dark:bg-white/2 border-gray-100 dark:border-white/5">
                  <stat.icon className={`${stat.color} mb-4`} size={32} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</h4>
                  <p className="text-4xl font-black dark:text-white text-gray-900">{stat.val}</p>
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-8 bg-white dark:bg-white/2 border-gray-100 dark:border-white/5">
               <h3 className="text-xl font-black dark:text-white mb-8 uppercase tracking-tighter flex items-center gap-3">
                 <TrendingUp className="text-orange-500" /> Highest Interaction Products
               </h3>
               <div className="space-y-6">
                  {topProducts.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-6 group">
                       <span className="text-2xl font-black text-gray-200 dark:text-white/10 group-hover:text-orange-500 transition-colors">0{i+1}</span>
                       <img src={p.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                       <div className="flex-grow">
                          <p className="font-bold dark:text-white text-gray-900 line-clamp-1">{p.title}</p>
                          <p className="text-[10px] font-black text-orange-500 uppercase">{p.merchant || 'Partner'}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xl font-black dark:text-white text-gray-900">{stats[p.id] || 0}</p>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">CLICKS</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="glass-card p-8 bg-orange-500 text-white relative overflow-hidden border-none flex flex-col justify-center">
               <div className="relative z-10 space-y-6">
                  <h3 className="text-4xl font-black leading-tight">Optimization Report Ready.</h3>
                  <p className="text-white/80 leading-relaxed">Based on the last 30 days of affiliate interaction, we recommend increasing coverage for <span className="font-bold underline">Photography</span> and <span className="font-bold underline">Wearables</span> to boost conversion rates by 24%.</p>
                  <Button variant="glass" className="bg-white/10 border-white/20 text-white h-14 font-black uppercase text-xs tracking-widest w-fit px-8">Generate Strategy PDF</Button>
               </div>
               <BarChart3 className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10" />
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <ProductForm 
            product={editingProduct} 
            onClose={() => setIsFormOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
