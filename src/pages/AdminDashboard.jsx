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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Product Management</h1>
          <p className="text-white/50">Manage your store inventory and affiliate links</p>
        </div>
        <Button onPointerUp={handleAddNew} className="gap-2">
          <Plus size={20} /> Add New Product
        </Button>
      </div>

      <div className="glass-card p-6">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <Input
            placeholder="Search products by name or category..."
            className="pl-12 bg-white/5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-sm">
                <th className="pb-4 font-medium px-4">Product</th>
                <th className="pb-4 font-medium px-4">Category</th>
                <th className="pb-4 font-medium px-4">Price</th>
                <th className="pb-4 font-medium px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                        <span className="text-white font-medium">{product.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white/60 text-sm">{product.category}</span>
                    </td>
                    <td className="py-4 px-4 text-white font-bold">${product.price}</td>
                    <td className="py-4 px-4">
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
