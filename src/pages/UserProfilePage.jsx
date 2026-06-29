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
    { name: 'Order History',       icon: Package },
    { name: 'Shipping Addresses',  icon: MapPin   },
    { name: 'Account Settings',    icon: Settings },
    { name: 'Product Reviews',     icon: Star     },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs text-amber-700 uppercase tracking-widest font-semibold mb-1">My Account</p>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>User Profile</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-72 shrink-0 space-y-4">
            {/* Avatar card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-600 mx-auto mb-4">
                <User size={40} strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Alex Johnson</h2>
              <p className="text-xs text-gray-400 mt-0.5">Premium Member since 2023</p>
              <div className="flex justify-center gap-2 mt-4">
                <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-widest">Explorer</span>
                <span className="px-2.5 py-1 bg-yellow-50 border border-yellow-200 text-yellow-700 text-[10px] font-bold rounded-full uppercase tracking-widest">Pro Reviewer</span>
              </div>
            </div>

            {/* Nav */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {menuItems.map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-700 transition-colors border-b last:border-0 border-gray-100 group">
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className="text-gray-400 group-hover:text-amber-600 transition-colors" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </button>
              ))}
            </div>

            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>

          {/* Main */}
          <div className="flex-grow space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-600 rounded-lg p-6 text-white relative overflow-hidden">
                <Package className="absolute -right-3 -bottom-3 w-20 h-20 opacity-10" />
                <p className="text-amber-100 text-xs font-semibold uppercase tracking-widest mb-1">Active Orders</p>
                <h4 className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>2</h4>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <Clock size={20} className="text-amber-600 mb-3" strokeWidth={1.75} />
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">Est. Delivery</p>
                <h4 className="text-lg font-bold text-gray-900">Oct 18, 2024</h4>
              </div>
            </div>

            {/* Recent orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Recent Purchases</h3>
                <button className="text-sm text-amber-700 font-medium hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {orders.map(order => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                        <Package size={20} className="text-amber-600" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                        <p className="text-xs text-gray-400">{order.date} · {order.items} items</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{order.total}</p>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <button className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                        <ChevronRight size={15} className="text-gray-500" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
