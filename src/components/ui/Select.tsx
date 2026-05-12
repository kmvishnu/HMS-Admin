import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string | number; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text-muted)]">
          {label}
        </label>
      )}
      
      {/* 1. Relative wrapper fixes absolute child alignment positioning */}
      <div className="relative w-full">
        <select
          className={`
            block h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] 
            pl-3 pr-10 py-2 text-sm text-[var(--color-text)] 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] 
            disabled:cursor-not-allowed disabled:opacity-50
            transition-all duration-200 hover:border-[var(--color-primary)]/50
            
            /* 2. appearance-none kills the broken native browser arrows */
            appearance-none cursor-pointer
            
            ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* 3. Custom dropdown indicator anchored outside the text-safe zone */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--color-text-muted)]">
          <svg 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
