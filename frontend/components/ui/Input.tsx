/**
 * UI Component Library - Input Component
 * Form input with proper accessibility and styling
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      iconPosition = 'left',
      className,
      type = 'text',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${React.useId()}`;
    const hasError = !!error;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-300"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              // Base styles
              'w-full h-10 rounded-xl',
              'bg-slate-900/50 backdrop-blur-sm',
              'border-2 transition-all duration-200',
              'text-white placeholder:text-slate-500',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950',
              
              // Border states
              hasError
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50'
                : 'border-indigo-500/30 focus:border-indigo-500 focus:ring-indigo-500/50',
              
              // Padding with icons
              icon && iconPosition === 'left' ? 'pl-10 pr-4' : 'pl-4',
              icon && iconPosition === 'right' ? 'pr-10' : 'pr-4',
              
              // Disabled state
              'disabled:opacity-50 disabled:cursor-not-allowed',
              
              className
            )}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p className={cn(
            'text-xs',
            hasError ? 'text-red-400' : 'text-slate-500'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ===== Textarea Component =====

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const textareaId = id || `textarea-${React.useId()}`;
    const hasError = !!error;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-slate-300"
          >
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            // Base styles
            'w-full min-h-[100px] rounded-xl p-4',
            'bg-slate-900/50 backdrop-blur-sm',
            'border-2 transition-all duration-200',
            'text-white placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950',
            'resize-vertical',
            
            // Border states
            hasError
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50'
              : 'border-indigo-500/30 focus:border-indigo-500 focus:ring-indigo-500/50',
            
            // Disabled state
            'disabled:opacity-50 disabled:cursor-not-allowed',
            
            className
          )}
          {...props}
        />
        
        {(error || helperText) && (
          <p className={cn(
            'text-xs',
            hasError ? 'text-red-400' : 'text-slate-500'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
