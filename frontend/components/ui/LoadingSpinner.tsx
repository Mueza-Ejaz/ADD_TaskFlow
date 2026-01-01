import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Tailwind color class, e.g., 'blue-500'
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'text-blue-500', className, ...props }) => {
  const spinnerSize = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  };

  const spinTransition = {
    repeat: Infinity,
    ease: 'linear',
    duration: 1,
  };

  return (
    <motion.div
      className={clsx(
        'rounded-full border-solid border-current border-r-transparent',
        spinnerSize[size],
        color,
        className
      )}
      animate={{ rotate: 360 }}
      transition={spinTransition}
      {...props}
    />
  );
};

export { LoadingSpinner };
