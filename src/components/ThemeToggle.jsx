import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const options = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'System' },
  ];

  const currentOption = options.find((o) => o.id === theme) || options[2];

  return (
    <div className="relative">
      <button
        onPointerUp={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 hover:bg-orange-500/20 transition-all flex items-center gap-2"
        title="Switch Theme"
      >
        <currentOption.icon size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onPointerUp={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-36 py-2 rounded-2xl bg-white dark:bg-premium-dark border border-premium-border-light dark:border-premium-border-dark shadow-2xl z-50 overflow-hidden"
            >
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onPointerUp={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 flex items-center gap-3 text-sm transition-colors ${
                    theme === opt.id 
                      ? 'text-orange-500 bg-orange-500/10' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  <opt.icon size={16} />
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
