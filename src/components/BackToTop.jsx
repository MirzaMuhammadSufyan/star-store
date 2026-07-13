import React from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Fixed “back to top” control — appears after the user scrolls down.
 * Mount once in the app shell so it works on every page.
 */
export default function BackToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setVisible((window.scrollY || document.documentElement.scrollTop) > 420);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lift transition-all duration-300 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 sm:bottom-6 sm:right-6 ${
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-3 opacity-0 pointer-events-none'
      }`}
    >
      <ArrowUp size={18} strokeWidth={2.25} />
    </button>
  );
}
