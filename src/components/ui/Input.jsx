import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Input = React.forwardRef(({ label, error, className, ...props }, ref) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 block">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 shadow-soft focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 focus:shadow-card transition-all',
          error && 'border-red-400 focus:ring-red-400/40',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export { Input };
