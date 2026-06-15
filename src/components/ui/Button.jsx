import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  const variants = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20',
    glass: 'glass-morphism hover:bg-white/10 text-gray-900 dark:text-white border-white/20',
    outline: 'border-2 border-orange-500/50 hover:border-orange-500 text-gray-900 dark:text-white',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/20'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5',
    lg: 'px-8 py-3.5 text-lg'
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

Button.displayName = 'Button';
export { Button };
