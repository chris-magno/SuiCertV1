/**
 * UI Component Library - Button Component
 * Following SOLID principles and composition patterns
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// ===== Types =====

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'base' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

// ===== Variant Styles (Single Responsibility) =====

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-indigo-600 to-indigo-500
    hover:from-indigo-700 hover:to-indigo-600
    active:from-indigo-800 active:to-indigo-700
    text-white font-semibold
    shadow-lg shadow-indigo-500/30
    hover:shadow-xl hover:shadow-indigo-500/40
    disabled:from-indigo-600/50 disabled:to-indigo-500/50
    disabled:shadow-none
  `,
  secondary: `
    bg-slate-800
    hover:bg-slate-750
    active:bg-slate-700
    text-white font-medium
    border border-slate-700
    hover:border-slate-600
    disabled:bg-slate-800/50
    disabled:border-slate-800
  `,
  outline: `
    bg-transparent
    hover:bg-indigo-950/30
    active:bg-indigo-950/50
    text-indigo-300
    border-2 border-indigo-500/50
    hover:border-indigo-500
    disabled:border-indigo-500/20
    disabled:text-indigo-500/50
  `,
  ghost: `
    bg-transparent
    hover:bg-white/5
    active:bg-white/10
    text-slate-300
    hover:text-white
    disabled:text-slate-600
  `,
  danger: `
    bg-red-600
    hover:bg-red-700
    active:bg-red-800
    text-white font-semibold
    shadow-lg shadow-red-500/30
    hover:shadow-xl hover:shadow-red-500/40
    disabled:bg-red-600/50
    disabled:shadow-none
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  base: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
};

// ===== Button Component =====

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'base',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'rounded-xl',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900',
          'disabled:cursor-not-allowed disabled:opacity-60',
          
          // Variant styles
          variantStyles[variant],
          
          // Size styles
          sizeStyles[size],
          
          // Full width
          fullWidth && 'w-full',
          
          // Custom className
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </button>
    );
  }
);

Button.displayName = 'Button';
