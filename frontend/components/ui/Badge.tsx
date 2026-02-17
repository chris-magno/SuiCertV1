/**
 * UI Component Library - Badge Component
 * Visual indicators and status badges
 */

import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'base' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-800 text-slate-300 border-slate-700',
  primary: 'bg-indigo-950/50 text-indigo-300 border-indigo-500/40',
  success: 'bg-green-950/50 text-green-300 border-green-500/40',
  warning: 'bg-yellow-950/50 text-yellow-300 border-yellow-500/40',
  error: 'bg-red-950/50 text-red-300 border-red-500/40',
  info: 'bg-blue-950/50 text-blue-300 border-blue-500/40',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  base: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'base',
  dot = false,
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'font-medium',
        'rounded-full',
        'border',
        'transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full',
          variant === 'primary' && 'bg-indigo-400',
          variant === 'success' && 'bg-green-400',
          variant === 'warning' && 'bg-yellow-400',
          variant === 'error' && 'bg-red-400',
          variant === 'info' && 'bg-blue-400',
          variant === 'default' && 'bg-slate-400',
        )} />
      )}
      {children}
    </span>
  );
};
