import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              flex h-10 w-full rounded-lg border border-[var(--color-border)] 
              bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)]
              file:border-0 file:bg-transparent file:text-sm file:font-medium 
              placeholder:text-[var(--color-text-muted)]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] 
              disabled:cursor-not-allowed disabled:opacity-50
              transition-colors duration-200
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
