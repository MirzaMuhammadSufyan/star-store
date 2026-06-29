import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) { return twMerge(clsx(inputs)); }

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  const base = 'inline-flex items-center justify-center font-medium rounded transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer select-none';

  const variants = {
    primary:   'bg-gray-900 text-white hover:bg-gray-800',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300',
    accent:    'bg-amber-600 text-white hover:bg-amber-700',
    ghost:     'bg-transparent text-gray-700 border border-gray-200 hover:bg-gray-50',
    danger:    'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
    /* compat aliases */
    glass:     'bg-transparent text-gray-700 border border-gray-200 hover:bg-gray-50',
    outline:   'bg-transparent text-gray-700 border border-gray-200 hover:bg-gray-50',
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs gap-1',
    sm: 'px-4 py-2.5 text-[13px] gap-1.5',
    md: 'px-5 py-2.5 text-[14px] gap-2',
    lg: 'px-7 py-3.5 text-[15px] gap-2',
  };

  return (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
});

Button.displayName = 'Button';
export { Button };
