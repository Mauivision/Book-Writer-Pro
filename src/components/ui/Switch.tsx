import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, checked, onChange, ...props }, ref) => {
    return (
      <label className="inline-flex items-center cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          {...props}
        />
        <div
          className={cn(
            'relative w-11 h-6 rounded-full transition-colors duration-200',
            checked ? 'bg-primary' : 'bg-gray-300',
            className
          )}
        >
          <div
            className={cn(
              'absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200',
              checked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </div>
        {label && (
          <span className="ml-3 text-sm font-medium text-text">{label}</span>
        )}
      </label>
    );
  }
); 