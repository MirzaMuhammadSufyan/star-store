import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { useConsentStore } from '../store/consentStore';

const COLS = {
  Shop:    [{ l: 'Home', p: '/' }, { l: 'All Products', p: '/catalog' }, { l: 'New Arrivals', p: '/catalog?featured=true' }, { l: 'Best Sellers', p: '/catalog?sort=popular' }],
  Support: [{ l: 'Contact Us', p: '/contact' }, { l: 'Shipping Policy', p: '/legal/shipping' }, { l: 'Returns', p: '/legal/refunds' }, { l: 'Cookie Policy', p: '/legal/cookies' }],
  Company: [{ l: 'About Us', p: '/about' }, { l: 'Journal', p: '/blog' }, { l: 'Gift Finder', p: '/gift-finder' }, { l: 'Partnerships', p: '/contact' }],
  Legal:   [{ l: 'Privacy Policy', p: '/legal/privacy' }, { l: 'Terms of Service', p: '/legal/terms' }, { l: 'Affiliate Disclosure', p: '/legal/disclaimer' }, { l: 'Cookies', p: '/legal/cookies' }],
};

export default function Footer() {
  const openManage = useConsentStore((s) => s.openManage);

  return (
    <footer className="bg-gray-900 text-gray-400 mt-10 shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-5">
            <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Star<span className="text-amber-400">Store</span>
            </p>
            <p className="text-[15px] leading-relaxed text-gray-400">Curated tech from verified official stores.</p>
            <div className="space-y-2.5">
              <a href="mailto:support@starstore.com" className="flex items-center gap-2.5 text-[14px] text-gray-400 hover:text-amber-400 transition-colors">
                <Mail size={14} /> support@starstore.com
              </a>
              <a href="tel:+15550001111" className="flex items-center gap-2.5 text-[14px] text-gray-400 hover:text-amber-400 transition-colors">
                <Phone size={14} /> +1 (555) 000-1111
              </a>
            </div>
          </div>

          {Object.entries(COLS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5">{heading}</h4>
              <ul className="space-y-3">
                {links.map(({ l, p }) => (
                  <li key={l}><Link to={p} className="text-[14px] text-gray-400 hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between gap-3 text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Star Store. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <button
              type="button"
              onClick={openManage}
              className="text-gray-500 hover:text-amber-400 transition-colors"
            >
              Cookie settings
            </button>
            <p>Affiliate Disclosure — We may earn from qualifying purchases.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
