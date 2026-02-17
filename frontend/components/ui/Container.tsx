/**
 * UI Component Library - Container Component
 * Layout container with max-width constraints
 */

import React from 'react';
import { cn } from '@/lib/utils';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  padding?: boolean;
}

const sizeStyles: Record<ContainerSize, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-[1400px]',
  full: 'max-w-full',
};

export const Container: React.FC<ContainerProps> = ({
  size = 'xl',
  padding = true,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        sizeStyles[size],
        padding && 'px-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
