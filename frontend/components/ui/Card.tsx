/**
 * UI Component Library - Card Component
 * Reusable card container with variants
 */

import React from 'react';
import { cn } from '@/lib/utils';

// ===== Types =====

export type CardVariant = 'default' | 'elevated' | 'bordered' | 'glass';
export type CardPadding = 'none' | 'sm' | 'base' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
  clickable?: boolean;
}

// ===== Variant Styles =====

const variantStyles: Record<CardVariant, string> = {
  default: `
    bg-slate-900/95
    border border-indigo-500/20
  `,
  elevated: `
    bg-slate-900/95
    border border-indigo-500/30
    shadow-2xl shadow-indigo-500/10
  `,
  bordered: `
    bg-slate-900/80
    border-2 border-indigo-500/40
  `,
  glass: `
    bg-slate-900/60
    backdrop-blur-xl
    border border-white/10
  `,
};

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-4',
  base: 'p-6',
  lg: 'p-8',
};

// ===== Card Component =====

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'base',
      hoverable = false,
      clickable = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-2xl',
          'transition-all duration-300',
          
          // Variant
          variantStyles[variant],
          
          // Padding
          paddingStyles[padding],
          
          // Interactive states
          hoverable && 'hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20',
          clickable && 'cursor-pointer active:scale-95',
          
          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// ===== Card Sub-components =====

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-bold text-white', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-slate-400', className)}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-0', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';
