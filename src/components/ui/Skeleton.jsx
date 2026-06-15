import React from 'react';
import { cn } from './Button';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-white/10", className)}
      {...props}
    />
  );
};
