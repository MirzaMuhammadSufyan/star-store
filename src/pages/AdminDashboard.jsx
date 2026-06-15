import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Package, Search } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import ProductForm from '../components/ProductForm';

const AdminDashboard = () => {
  const { products, deleteProduct } = useProductStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black dark:text-white text-orange-950">Product Management</h1>
          <p className="text-gray-500 font-medium">Manage your store inventory and affiliate links with AI precision.</p>
        </div>
        <Button onPointerUp={handleAddNew} className="gap-3 px-8 h-14 font-black uppercase text-xs tracking-widest shadow-orange-500/40">
          <Plus size={20} /> Add New Product
        </Button>
      </div>

      <div className="glass-card p-8 bg-white dark:bg-white/2 border-gray-100 dark:border-white/5">
        <div className="relative mb-10">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
          <Input
            placeholder="Search products by name or category..."
            className="pl-14 h-16 text-lg"
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
                <th className="pb-6 px-4">Listing Price</th>
                <th className="pb-6 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-orange-500/[0.02] transition-colors">
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-4">
                        <img src={product.image} className="w-14 h-14 rounded-2xl object-cover shadow-lg" alt="" />
                        <span className="dark:text-white text-gray-900 font-bold text-lg">{product.title}</span>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <span className="bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/60 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{product.category}</span>
                    </td>
                    <td className="py-6 px-4 dark:text-white text-gray-900 font-black text-xl">${product.price}</td>
                    <td className="py-6 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="glass"
                          size="sm"
                          className="p-2"
                          onPointerUp={() => handleEdit(product)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="p-2"
                          onPointerUp={() => {
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
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <Package size={48} className="mb-2" />
                      <p>No products found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
