import React from 'react';
import { motion } from 'framer-motion';
import { User, Package, MapPin, Settings, LogOut, ChevronRight, Star, Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';

const UserProfilePage = () => {
  const { logout } = useAuthStore();

  const orders = [
    { id: '#ST-1029', date: 'Oct 12, 2024', status: 'Delivered', total: '$349.00', items: 2 },
    { id: '#ST-0994', date: 'Sep 28, 2024', status: 'In Transit', total: '$1,299.00', items: 1 },
  ];

  const menuItems = [
    { name: 'Order History', icon: Package },
    { name: 'Shipping Addresses', icon: MapPin },
    { name: 'Account Settings', icon: Settings },
    { name: 'Product Reviews', icon: Star },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="md:w-1/3 space-y-8">
          <div className="glass-card p-8 bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-premium-purple/10 flex items-center justify-center text-premium-purple border-2 border-premium-purple/20 overflow-hidden">
                <User size={48} />
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white dark:border-premium-dark rounded-full" />
            </div>
            <h2 className="text-2xl font-bold dark:text-white">Alex Johnson</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Premium Member since 2023</p>
            <div className="mt-6 flex justify-center gap-2">
               <span className="px-3 py-1 bg-premium-purple/10 text-premium-purple text-[10px] font-bold rounded-full uppercase tracking-widest border border-premium-purple/20">Explorer</span>
               <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold rounded-full uppercase tracking-widest border border-yellow-500/20">Pro Reviewer</span>
            </div>
          </div>

          <div className="glass-card overflow-hidden bg-white dark:bg-white/5 border-gray-100 dark:border-white/10">
            {menuItems.map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b last:border-0 border-gray-100 dark:border-white/5 group"
              >
                <div className="flex items-center gap-4">
                   <div className="text-gray-400 group-hover:text-premium-purple transition-colors">
                      <item.icon size={18} />
                   </div>
                   <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            ))}
          </div>

          <Button
            variant="glass"
            className="w-full border-red-500/20 text-red-500 hover:bg-red-500/5 py-4 gap-2"
            onPointerUp={() => logout()}
          >
            <LogOut size={18} /> Logout Session
          </Button>
        </div>

        {/* Content */}
        <div className="md:w-2/3 space-y-12">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-card p-6 bg-premium-purple text-white relative overflow-hidden">
               <Package className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10" />
               <p className="text-white/60 text-sm font-bold uppercase tracking-widest mb-1">Active Orders</p>
               <h4 className="text-4xl font-black">2</h4>
            </div>
            <div className="glass-card p-6 bg-white dark:bg-white/5 border-gray-100 dark:border-white/10">
               <Clock className="text-premium-purple mb-4" size={24} />
               <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Estimated Delivery</p>
               <h4 className="text-2xl font-bold dark:text-white">Oct 18, 2024</h4>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold dark:text-white">Recent Purchases</h3>
              <button className="text-premium-purple text-sm font-bold hover:underline">View All</button>
            </div>

            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="glass-card p-6 bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-premium-purple/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-premium-purple">
                      <Package size={24} />
                    </div>
                    <div>
                      <h5 className="font-bold dark:text-white">{order.id}</h5>
                      <p className="text-xs text-gray-500">{order.date} • {order.items} Items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                     <div className="text-right">
                        <p className="text-sm font-bold dark:text-white">{order.total}</p>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {order.status}
                        </span>
                     </div>
                     <Button variant="glass" size="sm" className="p-2 border-gray-200 dark:border-white/10 dark:text-white">
                        <ChevronRight size={16} />
                     </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
