import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// Column data for the "Shop" mega menu. Each `path` uses the same
// `/catalog?cat=<keyword>` convention as HomePage's category tiles, so
// keywords here should stay aligned with functions/utils/relevance.js
// (KEYWORD_CATEGORY_MAP) to get category-narrowed, filtered results.
const COLUMNS = [
  {
    heading: 'Laptops & Computers',
    items: [
      { label: 'Laptops',          path: '/catalog?cat=laptop' },
      { label: 'Mini PCs',         path: '/catalog?cat=mini+pc' },
      { label: 'Monitors',         path: '/catalog?cat=monitor' },
      { label: 'Keyboards',        path: '/catalog?cat=keyboard' },
      { label: 'Mice',             path: '/catalog?cat=mouse' },
      { label: 'Webcams',          path: '/catalog?cat=webcam' },
    ],
  },
  {
    heading: 'Computer Accessories',
    items: [
      { label: 'Laptop Bags & Cases', path: '/catalog?cat=laptop+bag' },
      { label: 'External Storage',     path: '/catalog?cat=external+ssd' },
      { label: 'USB Hubs & Docks',     path: '/catalog?cat=usb+hub' },
      { label: 'Cooling Pads',         path: '/catalog?cat=laptop+cooling+pad' },
      { label: 'Cables & Adapters',    path: '/catalog?cat=usb+cable' },
      { label: 'Laptop Stands',        path: '/catalog?cat=laptop+stand' },
    ],
  },
  {
    heading: 'Smart Electronics',
    items: [
      { label: 'Smartphones',      path: '/catalog?cat=smartphone' },
      { label: 'Smartwatches',     path: '/catalog?cat=smartwatch' },
      { label: 'Tablets',          path: '/catalog?cat=tablet' },
      { label: 'Drones',           path: '/catalog?cat=drone' },
      { label: 'Smart Home',       path: '/catalog?cat=smart+home' },
      { label: 'VR Headsets',      path: '/catalog?cat=vr+headset' },
    ],
  },
  {
    heading: 'Audio & Gadgets',
    items: [
      { label: 'Headphones',        path: '/catalog?cat=headphones' },
      { label: 'Wireless Earbuds',  path: '/catalog?cat=wireless+earbuds' },
      { label: 'Bluetooth Speakers',path: '/catalog?cat=speaker' },
      { label: 'Cameras',           path: '/catalog?cat=camera' },
      { label: 'Power Banks',       path: '/catalog?cat=power+bank' },
      { label: 'Gaming Gear',       path: '/catalog?cat=gaming+headset' },
    ],
  },
];

const MegaMenu = ({ open, onOpen, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
          className="absolute top-full inset-x-0 bg-white border-b border-gray-200 shadow-lg z-40"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-600 mb-3">
                  {col.heading}
                </h3>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className="text-[14px] text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MegaMenuTrigger = ({ label, path, isActive, onOpen, onClose, open }) => (
  <div
    className="relative"
    onMouseEnter={onOpen}
    onMouseLeave={onClose}
  >
    <Link
      to={path}
      className={`flex items-center gap-1 text-[15px] transition-colors ${
        isActive ? 'text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      {label}
      <ChevronDown size={14} strokeWidth={2} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
    </Link>
  </div>
);

export default MegaMenu;
