import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'default'
    | 'danger'
    | 'link';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary text-white hover:bg-primary-dark':
              variant === 'primary' || variant === 'default',
            'bg-secondary text-white hover:bg-secondary-dark':
              variant === 'secondary',
            'border-2 border-primary text-primary hover:bg-primary hover:text-white':
              variant === 'outline',
            'bg-transparent text-slate-700 hover:bg-slate-100':
              variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
            'bg-transparent text-primary underline-offset-4 hover:underline':
              variant === 'link',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
); 