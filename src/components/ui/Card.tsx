import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  glass?: boolean;
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', glass = true, hoverEffect = false, children, ...props }, ref) => {
    
    const baseStyles = "rounded-2xl border border-[var(--color-border)] p-6";
    const glassStyles = glass ? "glass" : "bg-[var(--color-card)]";
    const hoverStyles = hoverEffect ? "transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:-translate-y-1" : "";

    return (
      <motion.div
        ref={ref}
        className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
