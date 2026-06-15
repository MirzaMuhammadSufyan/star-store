import React from 'react';
import { cn } from './Button';

const Input = React.forwardRef(({ className, error, label, ...props }, ref) => {
  return (
    <div className="w-full space-y-2">
      {label && <label className="text-sm font-medium text-white/70 ml-1">{label}</label>}
      <input
        ref={ref}
        className={cn(
          "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-premium-purple/50 transition-all",
          error && "border-red-500/50 focus:ring-red-500/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export { Input };
