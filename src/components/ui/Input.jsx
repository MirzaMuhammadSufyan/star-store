import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Input = React.forwardRef(({ label, error, className, ...props }, ref) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-xs font-black uppercase tracking-widest text-gray-400 block ml-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-3.5 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300',
          error && 'border-red-500/50 focus:ring-red-500/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-medium ml-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export { Input };
