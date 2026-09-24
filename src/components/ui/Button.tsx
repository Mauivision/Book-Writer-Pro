import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger'
    | 'default'
    | 'link';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const resolvedVariant = variant === 'default' ? 'primary' : variant;
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary text-white hover:bg-primary-dark':
              resolvedVariant === 'primary',
            'bg-secondary text-white hover:bg-secondary-dark':
              resolvedVariant === 'secondary',
            'border-2 border-primary text-primary hover:bg-primary hover:text-white':
              resolvedVariant === 'outline',
            'bg-transparent text-slate-700 hover:bg-slate-100':
              resolvedVariant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700': resolvedVariant === 'danger',
            'bg-transparent text-primary underline underline-offset-4':
              resolvedVariant === 'link',
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