import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={props.id} className="block text-sm font-semibold text-white/90">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-[15px] text-white transition-all duration-200',
            'placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00FFD1]/20 focus:border-[#00FFD1]/50',
            'disabled:cursor-not-allowed disabled:opacity-50 hover:border-white/20',
            error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {errors_display(error)}
      </div>
    );
  }
);

function errors_display(error?: string) {
  if (!error) return null;
  return <p className="text-xs font-medium text-red-400 mt-1">{error}</p>;
}

Input.displayName = 'Input';

export { Input };