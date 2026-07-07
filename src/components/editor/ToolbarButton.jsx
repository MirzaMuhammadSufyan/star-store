import React from 'react';
import { cn } from '../ui/Button';

/**
 * A single, icon-only toolbar control. Reflects the editor's active state
 * (e.g. bold is on at the cursor) via a filled dark pill, and disables
 * itself when the command can't currently run.
 */
export function ToolbarButton({ onClick, isActive = false, disabled = false, label, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // keep editor selection/focus
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={isActive}
      title={label}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition-colors',
        'hover:bg-slate-100 hover:text-slate-900',
        'disabled:pointer-events-none disabled:opacity-30',
        isActive && 'bg-slate-900 text-white hover:bg-slate-900 hover:text-white'
      )}
    >
      {children}
    </button>
  );
}
