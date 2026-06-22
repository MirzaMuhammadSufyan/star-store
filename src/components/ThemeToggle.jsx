import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { AnimatePresence, motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      onPointerUp={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2 rounded-lg text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 transition-all overflow-hidden"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="block"
          >
            <Moon size={18} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="block"
          >
            <Sun size={18} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
