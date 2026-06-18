import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotal } = useCartStore();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onPointerUp={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-premium-dark shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-orange-500" size={24} />
                <h2 className="text-xl font-bold dark:text-white">Your Cart</h2>
              </div>
              <button onPointerUp={closeCart} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                <X size={20} className="dark:text-white" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingBag size={64} className="mb-4" />
                  <p className="text-lg">Your cart is empty</p>
                  <Button onPointerUp={closeCart} variant="glass" className="mt-4">Start Shopping</Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <img src={item.image} className="w-20 h-20 rounded-xl object-cover border border-gray-100 dark:border-white/10" alt="" />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{item.title}</h3>
                        <button onPointerUp={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-orange-500 font-bold mt-1">${item.price}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden">
                          <button onPointerUp={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                            <Minus size={14} className="dark:text-white" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium dark:text-white">{item.quantity}</span>
                          <button onPointerUp={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                            <Plus size={14} className="dark:text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-500 dark:text-gray-400">Total</span>
                  <span className="font-bold text-gray-900 dark:text-white">${getTotal()}</span>
                </div>
                <Button 
                  className="w-full py-4 gap-3 text-lg"
                  onPointerUp={() => {
                    closeCart();
                    navigate('/checkout');
                  }}
                >
                  <CreditCard size={20} /> Checkout Now
                </Button>
                <p className="text-center text-xs text-gray-400">Free shipping on orders over $100</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
