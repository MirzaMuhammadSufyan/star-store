import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Share2, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    shop: [
      { name: 'Store Home', path: '/' },
      { name: 'Product Catalog', path: '/catalog' },
      { name: 'Latest Trends', path: '/catalog?featured=true' },
      { name: 'Best Sellers', path: '/catalog?sort=popular' },
    ],
    support: [
      { name: 'Contact Us', path: '/contact' },
      { name: 'Shipping Policy', path: '/legal/shipping' },
      { name: 'Refunds & Returns', path: '/legal/refunds' },
      { name: 'Order Tracking', path: '/profile' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/legal/privacy' },
      { name: 'Terms of Service', path: '/legal/terms' },
      { name: 'Disclaimer', path: '/legal/disclaimer' },
      { name: 'Cookie Policy', path: '/legal/cookies' },
    ],
    company: [
      { name: 'About Star Store', path: '/about' },
      { name: 'Our Blog', path: '/blog' },
      { name: 'Careers', path: '/about' },
      { name: 'Partnerships', path: '/contact' },
    ]
  };

  return (
    <footer className="bg-gray-50 dark:bg-black/40 border-t border-gray-200 dark:border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold dark:text-white">Star<span className="text-orange-500">Store</span></span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
              Premium affiliate marketing platform delivering top-tier gadgets and lifestyle products directly from verified official stores.
            </p>
            <div className="flex gap-4">
              {[Share2].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-orange-500 hover:border-orange-500 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title} className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-wider dark:text-white">{title}</h4>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-white transition-colors text-sm">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} Star Store. All rights reserved. Designed for Enterprise performance.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <Mail size={14} />
              <span>support@starstore.com</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <Phone size={14} />
              <span>+1 (555) 000-1111</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
